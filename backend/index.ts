import express, { Request, Response } from 'express'
import session from 'express-session'
import expressMySqlSession from 'express-mysql-session'
import 'express-async-errors'
import cors from 'cors'
import router from './routes'
import db from './models/index'
import errorHandler from './helpers/errorMiddleware'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt'
import socket from './services/socket.service'
import http from 'http'
import { cleanupInstances } from './controllers/instance.controllers'
import unknownPath from './helpers/unknownPath'
import { cleanupActivities } from './controllers/activity.controllers'
import path from 'path'
import environmentalVariableCheck from './helpers/environmetalVariableCheck'

environmentalVariableCheck()

db.sequelize.sync()

passport.use(new LocalStrategy({
  session: false
},
async (username, password, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        username: username
      }
    })

    const isCorrect = user ? await bcrypt.compare(password, user.password) : false

    if (!(user && isCorrect)) {
      return next({
        status: 401,
        name: 'UnauthorizedError',
        message: 'Incorrect username or password'
      })
    }

    return next(null, user)
  } catch (err) {
    console.error('Failed to authenticate user on passport local strategy: ', err)
    return next(err)
  }
}
))

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.MONITOR_SECRET
  },
  (payload, next) => {
    try {
      const token = db.Token.findOne({
        where: {
          id: payload.id
        }
      })

      if (token) {
        return next(null, token)
      }

      return next(null, false)
    } catch (err){
      next(err)
    }
  }
))

passport.serializeUser((user, next) => {
  // @ts-ignore
  next(null, user.id)
})

passport.deserializeUser(async (id, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: id
      }
    })

    next(null, user)
  } catch (err) {
    console.error('Failed to deserialize user: ', err)
    next(err)
  }
})

const app = express()
const server = http.createServer(app)
// @ts-ignore
const MySQLStore = expressMySqlSession(session)

const sessionStore = new MySQLStore({
  host: process.env.MONITOR_DB_HOST,
  user: process.env.MONITOR_DB_USER,
  password: process.env.MONITOR_DB_PASSWORD,
  database: process.env.MONITOR_SESSION_DB_NAME
})

const sessionInstance = session({
  // @ts-ignore
  secret: process.env.MONITOR_SECRET,
  store: sessionStore,
  unset: 'destroy',
  cookie: {
    secure: (process.env.MONITOR_SECURE === 'true'),
    maxAge: 8 * 3600 * 1000
  }
})

app.use(cors())
app.set('trust proxy', 1)
app.use(sessionInstance)
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')))
app.use(router)
app.use('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, 'build', 'index.html')))
app.use(errorHandler)
app.use(unknownPath)

const PORT = process.env.PORT || 8081
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

setInterval(() => {
  try {
    cleanupInstances()
    cleanupActivities()
  } catch (err) {
    console.error('Error cloaning up database: ', err)
  }
}, 24 * 3600 * 1000)

socket.connect(server, sessionInstance)
