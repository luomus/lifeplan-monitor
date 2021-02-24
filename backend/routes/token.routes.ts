import Router, { Request, Response } from 'express'
import {
  getTokens,
  addToken,
  deleteTokenById
} from '../controllers/token.controllers'

const tokenRouter = Router()

tokenRouter.get('/', async (req: Request, res: Response) => {
  await getTokens(req, res)
})

tokenRouter.post('/', async (req: Request, res: Response) => {
  await addToken(req, res)
})

tokenRouter.delete('/:id', async (req: Request, res: Response) => {
  await deleteTokenById(req, res)
})

export default tokenRouter