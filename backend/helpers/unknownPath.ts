import { Request, Response } from 'express'

//handles unkonown /api/-endpoints, others will just trigger reload in frontend
const unknownPath = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Unknown endpoint.'
  })
}

export default unknownPath