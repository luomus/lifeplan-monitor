import React, { useEffect, useRef } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState, setUserError } from '../stores'


const mapStateToProps = (state: RootState) => {
  const { user } = state

  return {
    user
  }
}

const mapDispatchToProps = {
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


export const TimeoutContext: React.Context<{ logoutTimer: any, createLogoutTimer: (expiresAt: Date) => void, clearLogoutTimer: () => void } | null> = React.createContext(null)
const TimeoutProvider = TimeoutContext.Provider

//Uses react context and provider allows children access to manipulate logout timer, which is triggered few seconds before session timout,
//with login component setting it upon login, and logout canceling it on logout.
const UserTimoutManager = (props: Props): JSX.Element => {
  const logoutTimer = useRef<null | NodeJS.Timeout>(null)
  const history = useHistory()

  useEffect(() => {
    if (props.user.userData && !logoutTimer.current) {
      createLogoutTimer(props.user.userData.expiresAt)
    } else if (!props.user.userData) {
      clearLogoutTimer()
    }

    return () => {
      clearLogoutTimer()
    }
  }, [])

  //forces logout 10s before cookie expiration, avoid situation where frontend is seemingly logged in but cookie is expired
  const createLogoutTimer = (expiresAt: Date) => {
    logoutTimer.current = setTimeout(
      () => {
        props.setUserError('User login expired.')
        history.push('/logout')
      },
      (new Date(expiresAt).getTime() - new Date().getTime() - 10000)
    )
  }

  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current)
    }
  }

  return (
    <TimeoutProvider value={{
      logoutTimer,
      createLogoutTimer,
      clearLogoutTimer
    }}>
      {props.children}
    </TimeoutProvider>
  )
}

export default connector(UserTimoutManager)