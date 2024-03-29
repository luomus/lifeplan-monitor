import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { io, Socket } from 'socket.io-client'
import {
  RootState,
  setInstances,
  addInstance,
  updateInstance,
  deleteInstance,
  deleteActivity,
  updateInstanceAndActivity,
  userLogout,
  setUserError
} from '../stores'


const mapStateToProps = (state: RootState) => {
  const { user } = state

  return {
    user
  }
}

const mapDispatchToProps = {
  setInstances,
  addInstance,
  updateInstance,
  deleteInstance,
  deleteActivity,
  updateInstanceAndActivity,
  userLogout,
  setUserError
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type ReduxProps = ConnectedProps<typeof connector>
type Props = ReduxProps & {
  children: JSX.Element
}

//Uses react context provide all contained children access to socket.io
export const SocketContext: React.Context<{ socket: Socket, createSocket: () => void } | null> = React.createContext(null)
const SocketProvider = SocketContext.Provider

const SocketManager = (props: Props): JSX.Element => {
  const [ socket, setSocket ] = useState<Socket | null>(null)

  //usesr is logged in but socket is not connected open connection to monitor backend, else if connection is open but user
  //is not logged in disconnect socket, although backend will refuse connection anyway if user has logged out or session has timed out
  useEffect(() => {
    if (props.user.userData && !socket?.connected) {
      createSocket()
    } else if (!props.user.userData && socket?.connected) {
      socket.disconnect()
    }

    return () => {
      if (socket?.connected) {
        socket.disconnect()
      }
    }
  }, [])

  const createSocket = () => {
    try {
      const socket = io({
        withCredentials: true,
      })

      setSocket(socket)

      socket.on('initialize', (data) => {
        props.setInstances(data)
      })

      socket.on('connect_error', (data) => {
        props.setUserError(`Socket error: ${data.message}`)
      })

      socket.on('add_instance', (data) => {
        props.addInstance(data)
      })

      socket.on('update_instance', (data) => {
        props.updateInstance(data)
      })

      socket.on('update_instance_activity', (data) => {
        props.updateInstanceAndActivity(data)
      })

      socket.on('delete_instance', (data) => {
        props.deleteInstance(data)
      })

      socket.on('delete_activity', (data) => {
        props.deleteActivity(data)
      })

    } catch (err) {
      props.setUserError(`Socket error: ${err}`)
    }
  }

  return (
    <SocketProvider value={{
      socket,
      createSocket
    }}>
      {props.children}
    </SocketProvider>
  )
}

export default connector(SocketManager)