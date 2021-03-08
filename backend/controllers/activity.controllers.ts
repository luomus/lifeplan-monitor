import { Request, Response } from 'express'
import { Transaction } from 'sequelize/types'
import db from '../models'
import socket from '../services/socket.service'

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

  socket.connection()?.emit('update_instance_activity', result)
  res.status(200).send(result)
}

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