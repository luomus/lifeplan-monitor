import { Request, Response, NextFunction } from 'express'
import passport from 'passport'


//Midlleware for routers to autheticate requests for both login sessions and jwt:s, either for only one method
//or both, depending on the route
const  isAuthenticated = (type: string) => (req: Request, res: Response, next: NextFunction): void => {
  if (type === 'session' && req.isAuthenticated()) {
    return next()
  } else if (type === 'jwt') {
    return passport.authenticate('jwt', { session: false })(req, res, next)
  } else if (type === 'both') {
    if (req.headers.authorization) {
      return passport.authenticate('jwt', { session: false })(req, res, next)
    } else if (req.isAuthenticated()) {
      return next()
    }
  }

  next({
    status: 401,
    name: 'UnauthorizedError',
    message: 'Unauthorized'
  })
}

export default isAuthenticated