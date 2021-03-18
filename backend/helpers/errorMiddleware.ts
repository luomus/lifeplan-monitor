import { NextFunction, Request, Response } from 'express'

//handles erros thrown in routers
const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  if (error.name === 'UnauthorizedError') {
    res.status(error.status).json({
      error: error.message
    })
  } else if (error.name === 'SequelizeValidationError') {
    res.status(400).json({
      error: error.message
    })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    let errormessage = ''

    error.errors.forEach((err, index) => {
      if (index === 0) {
        errormessage = err.message
      } else {
        errormessage += ', ' + err.message
      }
    })

    res.status(400).json({
      error: errormessage
    })
  } else {
    res.status(500).json({
      error: error.message
    })
  }

}

export default errorHandler