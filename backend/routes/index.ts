import Router from 'express'
import instanceRouter from './instance.routes'
import activityRouter from './activity.routes'
import {
  loginRouter,
  logoutRouter
} from './auth.routes'
import tokenRouter from './token.routes'
import lifeplanRouter from './lifeplan.routes'
import passport from 'passport'
import isAuthenticated from '../helpers/authenticationMiddleware'

const router = Router()

router.use(
  '/api/instance',
  isAuthenticated('both'),
  instanceRouter
)
router.use(
  '/api/activity',
  isAuthenticated('both'),
  activityRouter
)
router.use(
  '/api/login',
  passport.authenticate('local'),
  loginRouter
)
router.use(
  '/api/logout',
  isAuthenticated('session'),
  logoutRouter
)
router.use(
  '/api/token',
  isAuthenticated('session'),
  tokenRouter
)

router.use(
  '/api/lifeplan',
  isAuthenticated('session'),
  lifeplanRouter
)

export default router