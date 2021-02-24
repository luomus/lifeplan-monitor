import { Router } from 'express'
import { getLifeplanData } from '../controllers/lifeplan.controllers'

const lifeplanRouter = Router()

lifeplanRouter.get('/', async (req, res) => {
  await getLifeplanData(req, res)
})

export default lifeplanRouter