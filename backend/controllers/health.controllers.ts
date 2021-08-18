import db from '../models'
import { Request, Response } from 'express'
import moment from 'moment'

export const getMiddlesoftwareStatus = async (req: Request, res: Response) => {
  //Check if last update was received more than a day ago from the internal updatedAt variable
  if (req.app.locals.updatedAt && moment(req.app.locals.updatedAt).isBefore(moment().subtract(1, 'days'))) {
    return res.status(500).json({
      error: 'Middlesoftware problem, last update received more than a day ago.'
    })
  }

  //Check if last instance reported failure to fetch activities, signalling problems with lifeplan
  let lastInstance = await db.Instance.findAll({
    limit: 1,
    order: [[ 'updatedAt', 'DESC' ]]
  })

  if (lastInstance.length === 0) {
    return res.status(200).send()
  }

  lastInstance = lastInstance[0]

  if (lastInstance.status === 'instance.status.3' && lastInstance.notes === 'Failure fetching activities.') {
    return res.status(500).json({
      error: 'Middlesoftware problem, failure to fetch activities from lifeplan.'
    })
  }

  //check running middlesoftware instances if any have been running without reprting updates for longer than a day
  const runningInstances = await db.Instance.findAll({
    where: {
      status: 'instance.status.0'
    }
  })

  let count = 0

  runningInstances.forEach(instance => {
    if (moment(instance.updatedAt).isBefore(moment().subtract(1, 'days'))) {
      count++
    }
  })

  if (count !== 0) {
    return res.status(500).json({
      error: `Middlesoftware problem, ${count} running MS instances updated more than a day ago.`
    })
  }

  //check last activity for problems creating buckets, possibly meaning failures of allas keys
  let lastActivity = await db.Activity.findAll({
    limit: 1,
    order: [[ 'updatedAt', 'DESC' ]]
  })

  if (lastActivity.length === 0) {
    return res.status(200).send()
  }

  lastActivity = lastActivity[0]

  if (lastActivity.status === 'activity.status.4' && lastActivity.notes === 'Error creating bucket.') {
    return res.status(500).json({
      error: 'Middlesoftware problem, failing on bucket creation.'
    })
  }

  res.status(200).send()
}