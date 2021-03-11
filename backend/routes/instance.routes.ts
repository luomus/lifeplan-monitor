import Router, { Request, Response } from 'express'
import {
  addInstance,
  updateInstanceById,
  deleteInstanceById,
  getAllInstaces,
  stopInstance,

} from '../controllers/instance.controllers'

const instanceRouter = Router()

instanceRouter.get('/', async (req: Request, res: Response) => {
  await getAllInstaces(req, res)
})

instanceRouter.post('/', async (req: Request, res: Response) => {
  await addInstance(req, res)
})

instanceRouter.patch('/:id', async (req: Request, res: Response) => {
  await updateInstanceById(req, res)
})

instanceRouter.delete('/:id', async (req: Request, res: Response) => {
  await deleteInstanceById(req, res)
})

instanceRouter.patch('/stop/:id', async (req: Request, res: Response) => {
  await stopInstance(req, res)
})

export default instanceRouter