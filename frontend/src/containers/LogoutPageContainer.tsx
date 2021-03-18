import React, { useContext, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { clearInstances, userLogout, RootState } from '../stores'
import { SocketContext } from '../providers/SocketManager'
import { Spinner } from 'react-bootstrap'
import { TimeoutContext } from '../providers/UserTimeoutManager'

const mapStateToProps = (state: RootState) => {
  const { user } = state

  return {
    user
  }
}

const mapDispatchToProps = {
  userLogout,
  clearInstances
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

const LogoutPageContainer = (props: Props): JSX.Element => {
  const socketContext = useContext(SocketContext)
  const timeoutContext = useContext(TimeoutContext)
  const history = useHistory()

  useEffect(() => {
    timeoutContext.clearLogoutTimer()
    props.userLogout(
      socketContext.socket,
      () => history.push('/login'),
      //clears the logout-timout as it becomes unnecessary upon logout
      timeoutContext.clearLogoutTimer
    )
  }, [])

  return (
    <Spinner animation={'border'} variant={'primary'}/>
  )
}

export default connector(LogoutPageContainer)