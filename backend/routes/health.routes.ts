import Router, { Request, Response } from 'express'
import { getMiddlesoftwareStatus } from '../controllers/health.controllers'
const healthRouter = Router()

//req.logout triggers pasport to log session out
healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).send()
})

healthRouter.get('/middlesoftware', async (req: Request, res: Response) => {
  await getMiddlesoftwareStatus(req, res)
})

export default healthRouter
