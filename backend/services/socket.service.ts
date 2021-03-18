import { Server } from 'http'
import passport from 'passport'
import { Server as IoServer, Socket as IoSocket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import db from '../models'

let connection: Socket | null = null


//eanbles the use of express middleware as socket middleware
const wrap = (
  middleware: (req: any, res: any, next: any) => void
) => (
  socket: IoSocket, next: (err?: ExtendedError | undefined) => void
) => {
  return middleware(socket.request, {}, next)
}

export class Socket {
  socketIO: IoServer | null

  constructor() {
    this.socketIO = null
  }

  connect = (server: Server, sessionInstance: any): void => {
    const io = new IoServer(server, {
      cookie: true,
    })

    this.socketIO = io

    //uses same session management as api-endpoints to authenticate socket communication
    io.use(wrap(sessionInstance))
    io.use(wrap(passport.initialize()))
    io.use(wrap(passport.session()))
    io.use((socket, next) => {
      // @ts-ignore
      if (socket.request.isAuthenticated()) {
        return next()
      }

      next(new Error('401 Unauthorized'))
    })
    io.on('connection', socket => {
      this.sendInitial(socket)
    })
  }

  //wen a client connects for the first time sends the instances to it
  sendInitial = async (socket: Socket): Promise<void> => {
    const instances = await db.Instance.findAll({
      include: [{
        model: db.Activity,
        as: 'activities',
        through: {
          attributes: []
        }
      }]
    })

    socket.emit('initialize', instances)
  }

  emit = (event: string, data: any): void => {
    if (this.socketIO) {
      this.socketIO.emit(event, data)
    }
  }

  send = (event: string): void => {
    if (this.socketIO) {
      this.socketIO.send(event)
    }
  }

  static init = (server: Server, sessionInstance: any): void => {
    if (!connection) {
      connection = new Socket()
      connection.connect(server, sessionInstance)
    }
  }

  static getConnection = (): Socket | null => {
    return connection
  }
}

export default {
  connect: Socket.init,
  connection: Socket.getConnection
}
