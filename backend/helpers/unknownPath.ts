import { Request, Response } from 'express'

const unknownPath = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Unknown endpoint.'
  })
}

export default unknownPath