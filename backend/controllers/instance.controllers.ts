import { Request, Response } from 'express'
import db from '../models'
import { Op, Transaction } from 'sequelize'
import socket from '../services/socket.service'

export const cleanupInstances = async (): Promise<void> => {
  const msDate = new Date().getTime()
  const include = [{
    model: db.Activity,
    as: 'activities',
    required: false,
    where: {
      processedBy: { [Op.col]: 'Instance.id' }
    },
    through: {
      attributes: []
    }
  }]

  const finder = (instanceStatus: string, expirationAge: number) => {
    return {
      [Op.and]: {
        status: {
          [Op.eq]: instanceStatus
        },
        updatedAt: {
          [Op.lt]: msDate - expirationAge * 24 * 3600 * 1000
        }
      }
    }
  }

  const inprogressMaxAge = process.env.MONITOR_INPROGRESS_MAX_AGE
  const completedMaxAge = process.env.MONITOR_COMPLETED_MAX_AGE
  const partialMaxAge = process.env.MONITOR_PARTIAL_MAX_AGE
  const failedMaxAge = process.env.MONITOR_FAILED_MAX_AGE

  if ( !(inprogressMaxAge && completedMaxAge && partialMaxAge && failedMaxAge)) {
    console.error('Missing database max age envionmetal variables.')
    return
  }

  const instances = await db.Instance.findAll({
    where: {
      [Op.or]: [
        finder('instance.status.0', parseInt(inprogressMaxAge)),
        finder('instance.status.1', parseInt(completedMaxAge)),
        finder('instance.status.2', parseInt(partialMaxAge)),
        finder('instance.status.3', parseInt(failedMaxAge))
      ]
    },
    include
  })

  await Promise.all(instances.map(async (instance: any) => {
    const result = await db.sequelize.transaction(async (t: Transaction) => {
      const activities = instance.activities

      await Promise.all(activities.map(async (activity: any) => {
        await activity.destroy({ transaction: t })
      }))

      await instance.destroy({ transaction: t })

      return instance.id
    })

    socket.connection()?.emit('delete_instance', result)
  }))
}

export const getAllInstaces = async (req: Request, res: Response): Promise<void> => {
  const instances = await db.Instance.findAll({
    include: [{
      model: db.Activity,
      as: 'activities',
      through: {
        attributes: []
      }
    }]
  })

  res.status(200).send(instances.map((instance: any) => instance.toJSON()))
}

export const addInstance = async (req: Request, res: Response): Promise<void> => {
  const result = await db.sequelize.transaction(async (t: Transaction) => {
    const newInstance = await db.Instance.create(
      req.body.instance,
      { transaction: t }
    )

    const toReturn = newInstance.toJSON()

    const activities = req.body.instance.activities

    if (activities) {
      toReturn.activities = []

      await Promise.all(activities.map(async (activity: any) => {
        let newActivity = await db.Activity.findOne({
          where: {
            id: activity.id
          }
        })

        if (!newActivity) {
          newActivity = await db.Activity.create(
            activity,
            { transaction: t }
          )
        }

        await newInstance.addActivity(
          newActivity,
          { transaction: t }
        )

        toReturn.activities.push(newActivity.toJSON())
      }))
    }

    return toReturn
  })

  res.status(201).send(result)
  socket.connection()?.emit('add_instance', result)
}

export const updateInstanceById = async (req: Request, res: Response): Promise<void> => {
  const result = await db.sequelize.transaction(async (t: Transaction) => {
    const addActivities = req.body.include_activities
    const noActivities = req.body.no_activities
    const instance = req.body.instance

    const updatedInstance = await db.Instance.findOne({
      where: {
        id: req.params.id
      }
    }, {
      transaction: t
    })

    await updatedInstance.update(instance)

    const toReturn = updatedInstance.toJSON()

    if (!noActivities) {
      timedInstanceDelete(req.params.id)
      return toReturn
    }

    if (!addActivities) {
      return toReturn
    }

    const activities = instance.activities
    toReturn.activities = []

    await Promise.all(activities.map(async (activity: any) => {
      let newActivity = await db.Activity.findOne({
        where: {
          id: activity.id
        }
      })

      if (!newActivity) {
        newActivity = await db.Activity.create(
          activity,
          { transaction: t }
        )
      } else if (newActivity.status === 'failed') {
        await newActivity.update(
          activity,
          { transaction: t }
        )
      }

      await updatedInstance.addActivity(
        newActivity,
        { transaction: t }
      )
      toReturn.activities.push(newActivity.toJSON())
    }))

    return toReturn
  })

  res.status(200).send(result)
  socket.connection()?.emit('update_instance', result)
}

const timedInstanceDelete = (id: string) => {
  setTimeout(async () => {
    const instance = await db.Instance.findOne({
      where: {
        id: id
      }
    })

    await instance.destroy()
    socket.connection()?.emit('delete_instance', id)
  }, 60 * 1000)
}

export const deleteInstanceById = async (req: Request, res: Response): Promise<void> => {
  const result = await db.sequelize.transaction(async (t: Transaction)  => {
    const instance = await db.Instance.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: db.Activity,
        as: 'activities',
        required: false,
        where: {
          processedBy: { [Op.col]: 'Instance.id' }
        },
        through: {
          attributes: []
        }
      }
    })

    const activities = instance.activities

    Promise.all(activities.map(async (activity: any) => {
      await activity.destroy({ transaction: t })
    }))

    await instance.destroy({ transaction: t })

    return req.params.id
  })

  res.status(204).send()
  socket.connection()?.emit('delete_instance', result)
}