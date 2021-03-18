import Router, { Request, Response } from 'express'
import { updateActivityById } from '../controllers/activity.controllers'

const activityRouter = Router()

activityRouter.patch('/:id', async (req: Request, res: Response) => {
  await updateActivityById(req, res)
})

export default activityRouter