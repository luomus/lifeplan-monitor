import Router, { Request, Response } from 'express'

const loginRouter = Router()
const logoutRouter = Router()

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

logoutRouter.get('/', (req, res) => {
  req.logout()
  res.status(204).send()
})

export {
  loginRouter,
  logoutRouter,
}