import Router, { Request, Response } from 'express'

const loginRouter = Router()
const logoutRouter = Router()


//simply sends back some user info if authetication done by passport attached to this enpoint suceeded as denoted by req.user
loginRouter.post('/', (req: Request, res: Response) => {
  if (req.user) {
    res.send({
      // @ts-ignore
      id: req.user.id,
      // @ts-ignore
      username: req.user.username,
      expiresAt: req.session.cookie.expires
    })
  }
})

//req.logout triggers pasport to log session out
logoutRouter.get('/', (req, res) => {
  req.logout()
  res.status(204).send()
})

export {
  loginRouter,
  logoutRouter,
}