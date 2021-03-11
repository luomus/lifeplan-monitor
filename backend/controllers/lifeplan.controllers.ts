import { Request, Response } from 'express'
import { getActivities, getTotalCount, resetActivity } from '../services/lifeplan.service'
import db from '../models'
import socket from '../services/socket.service'

export const getLifeplanData = async (req: Request, res: Response): Promise<void> => {
  const getPrunedList = async (status: string): Promise<any[]> => {
    const activities = await getActivities(status)

    return activities.map(activity => {
      const prunedActivity = {
        id: activity.id,
        uuid: activity.uuid,
        status: '',
        createdAt: activity.created_at,
        updatedAt: activity.updated_at
      }

      if (activity.processing_status === 'in-progress') {
        prunedActivity.status = 'activity.lifeplan.status.1'
      } else if (activity.processing_status === 'failed') {
        prunedActivity.status = 'activity.lifeplan.status.3'
      }

      return prunedActivity
    })
  }

  const count = {
    'activity.lifeplan.status.0': 0,
    'activity.lifeplan.status.1': 0,
    'activity.lifeplan.status.2': 0,
    'activity.lifeplan.status.3': 0
  }

  let failedActivities: any[] = []
  let inProgresActivities: any[] = []

  try {
    failedActivities = await getPrunedList('failed')
    count['activity.lifeplan.status.3'] = failedActivities.length
  } catch (err) {
    res.status(500).json({
      error: `Request to Lifeplan backend for failed activities failed with status ${err.response.status}`
    })
    return
  }

  try {
    inProgresActivities = await getPrunedList('in-progress')
    count['activity.lifeplan.status.1'] = inProgresActivities.length
  } catch (err) {
    res.status(500).json({
      error: `Request to Lifeplan backend for in-progress activities failed with status ${err.response.status}`
    })
    return

  }

  try {
    count['activity.lifeplan.status.0'] = await getTotalCount('unprocessed')
  } catch (err) {
    res.status(500).json({
      error: `Request to Lifeplan backend for unprocessed activities failed with status ${err.response.status}`
    })
    return
  }

  try {
    count['activity.lifeplan.status.2'] = await getTotalCount('completed')
  } catch (err) {
    res.status(500).json({
      error: `Request to Lifeplan backend for completed activities failed with status ${err.response.status}`
    })
    return
  }

  const toReturn = {
    count,
    activities: failedActivities.concat(inProgresActivities)
  }

  res.status(200).send(toReturn)
}

export const resetLifeplanActivity = async (req: Request, res: Response) => {
  try {
    await resetActivity(req.params.id)

  } catch (err) {
    res.status(500).json({
      error: `Proxy request to Lifepan backend for resetting activity ${req.body} failed with status ${err.response.status}`
    })
  }
  const activity = await db.Activity.findOne({
    where: {
      id: req.params.id
    }
  })

  await activity?.destroy()
  socket.connection()?.emit('delete_activity', req.params.id)
  res.status(200).send()
}