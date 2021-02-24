import Router, { NextFunction, Request, Response } from 'express'
import { updateActivityById } from '../controllers/activity.controllers'

const activityRouter = Router()

activityRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  await updateActivityById(req, res)
})

export default activityRouter