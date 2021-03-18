import { Request, Response } from 'express'
import db from '../models'
import { Op, Transaction } from 'sequelize'
import socket from '../services/socket.service'
import { resetActivity } from '../services/lifeplan.service'


//For cleaning up instances that have gotten older than each types max ages, also remove activities that have been processed by them
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

  //Is already checked in index.ts, so should not trigger outside of very unexpected cases
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

    //If nothing goes wrong in transaction update all running fronts via socket
    socket.connection()?.emit('delete_instance', result)
  }))
}


//Used in case of the openshift pod running middlesoftware getting stuck and being removed to clean it up on the monitor
export const stopInstance = async (req: Request, res: Response) => {
  //find instance and only the activity being processed by it.
  const instance = await db.Instance.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: db.Activity,
      required: false,
      as: 'activities',
      through: {
        attributes: []
      },
      where: {
        [Op.and]: {
          status: { [Op.or]: [
            'activity.status.1',
            'activity.status.2'
          ] },
          processedBy: { [Op.col]: 'Instance.id' }
        }
      },
    }]
  })

  //Check that instances status is processing as expected.
  if (instance.status !== 'instance.status.0') {
    return res.status(500).json({
      error: 'Setting instances status to stopped is only allowed if instances state is processing.'
    })
  }

  //An instance should only have one activity in-progres or under deletion at a time, so this should not trigger normally
  if (instance.activities.length > 1) {
    return res.status(500).json({
      error: `Expected at maximum one activity belonging to instance to be either in in-progress or deleting state, found ${instance.activities.length} activities.`
    })
  }

  //Switch instance to partial failure state and notify that it had been forcibly switched
  instance.update({
    status: 'instance.status.2',
    notes: 'Forcibly stopped.'
  })

  //remove activities from instance, as activity removal will be done later on, send update trough socket.
  // @ts-ignore
  const { activities, ...rest } = instance.toJSON()
  socket.connection()?.emit('update_instance', rest)

  const activity = instance.activities[0]

  if (!activity) {
    return res.status(200).send(rest)
  }

  const id = activity.id

  //try to reset activity on lifeplan backend, else pass error along to frontend
  try {
    await resetActivity(id)

  } catch (err) {
    return res.status(500).json({
      error: `Proxy request to Lifepan backend for resetting activity ${id} failed with status ${err.response.status}.`
    })
  }


  activity.destroy()

  //pass removal along to running front sessions witch socket
  socket.connection()?.emit('delete_activity', id)
  return res.status(200).send(instance.toJSON())
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

    //Due to the way middlesoftware is currently used, should not activate, as activities are sent by ms later
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

  socket.connection()?.emit('add_instance', result)
  res.status(201).send(result)
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

    //triggered when ms int find new activities to process, so remove the instance after 1min timer to avoid
    //crowding monitor with instances without actual information
    if (noActivities) {
      timedInstanceDelete(req.params.id)
      return toReturn
    }

    //flag to control if monitor should add new activities belonging to instance, contiunuing should happen when middlesoftware
    //is sending activities extracted from Lifeplan backend
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

  socket.connection()?.emit('update_instance', result)
  res.status(200).send(result)
}


//1 min timed deletion of instance, expected to not have activities, hence they are not touched
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


//destroys instance, and activities that are marked by processedBy as belonging to to it
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

  socket.connection()?.emit('delete_instance', result)
  res.status(204).send()
}