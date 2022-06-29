import Router, { Request, Response } from 'express'
import { getFailedActivities, updateActivityById } from '../controllers/activity.controllers'

const activityRouter = Router()

activityRouter.patch('/:id', async (req: Request, res: Response) => {
  await updateActivityById(req, res)
})

activityRouter.get('/failed', async (req: Request, res: Response) => {
  await getFailedActivities(req, res)
})

export default activityRouter