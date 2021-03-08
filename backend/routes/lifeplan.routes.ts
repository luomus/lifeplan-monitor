import { Router } from 'express'
import { getLifeplanData, resetLifeplanActivity } from '../controllers/lifeplan.controllers'

const lifeplanRouter = Router()

lifeplanRouter.get('/', async (req, res) => {
  await getLifeplanData(req, res)
})

lifeplanRouter.patch('/:id', async (req, res) => {
  await resetLifeplanActivity(req, res)
})

export default lifeplanRouter