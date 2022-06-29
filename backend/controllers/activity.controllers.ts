import { Request, Response } from 'express'
import { Op, Transaction } from 'sequelize'
import db from '../models'
import socket from '../services/socket.service'

const setLastUpdate = (req: Request, date: Date) => {
  req.app.locals.updatedAt = date
}

//update activity, and selectively update updatedAt-field on instance which is processing the activity in question
export const updateActivityById = async (req: Request, res: Response): Promise<void> => {
  const result = await db.sequelize.transaction(async (t: Transaction) => {
    const updatedActivity = await db.Activity.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: db.Instance,
        as: 'instances',
        required: false,
        through: {
          attributes: []
        }
      }
    })

    await updatedActivity.update(req.body.activity, {
      transaction: t
    })

    const instaces = updatedActivity.instances

    await Promise.all(
      instaces.map(async (instance: any) => {
        if (instance.id === updatedActivity.processedBy) {
          instance.changed('updatedAt', true)
          await instance.update({ updatedAt: updatedActivity.updatedAt }, {
            transaction: t
          })
        }
      })
    )

    return updatedActivity.toJSON()
  })

  setLastUpdate(req, result.updatedAt)

  socket.connection()?.emit('update_instance_activity', result)
  res.status(200).send(result)
}


//cleans uo orphaned activities from the database
export const cleanupActivities = async (): Promise<void> => {
  const activities = await db.Activity.findAll({
    include: {
      model: db.Instance,
      as: 'instances',
      through: {
        attributes: []
      }
    }
  })

  await Promise.all(activities.map(async (activity: any) => {
    if (activity.instances.length === 0) {
      await activity.destroy()
    }
  }))
}

//get all failed activities or activities which failed to delete data from nextcloud
export const getFailedActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const date = req.query.dateFrom?.toString()

    let activities = []

    if (date) {
      activities = await db.Activity.findAll({
        where: {
          [Op.and]: {
            [Op.or]: {
              status: {
                [Op.eq]: 'activity.status.4'
              },
              [Op.and]: {
                status: {
                  [Op.eq]: 'activity.status.3'
                },
                notes: {
                  [Op.eq]: 'Error deleting files.'
                }
              }
            },
            updatedAt: {
              [Op.gt]: new Date(date)
            }
          }
        },
        attributes: ['id', 'notes']
      })
    } else {
      activities = await db.Activity.findAll({
        where: {
          [Op.and]: {
            [Op.or]: {
              status: {
                [Op.eq]: 'activity.status.4'
              },
              [Op.and]: {
                status: {
                  [Op.eq]: 'activity.status.3'
                },
                notes: {
                  [Op.eq]: 'Error deleting files.'
                }
              }
            },
          }
        },
        attributes: ['id', 'notes']
      })
    }

    res.status(200).send(activities.map((activity: any) => activity.toJSON()))
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}