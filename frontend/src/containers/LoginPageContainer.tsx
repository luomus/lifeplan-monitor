import React, { useContext } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useHistory } from 'react-router-dom'
import LoginFormComponent from '../components/LoginFormComponent'
import useField from '../hooks/fieldHook'
import { userLogin, RootState } from '../stores'
import { SocketContext } from '../providers/SocketManager'
import { TimeoutContext } from '../providers/UserTimeoutManager'

const mapStateToProps = (state: RootState) => {
  const { user } = state

  return {
    user
  }
}

const mapDispatchToProps = {
  userLogin
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

const LoginFormContainer = (props: Props): JSX.Element => {
  const credentials = { username: useField('text'), password: useField('password') }
  const history = useHistory()
  const socketContext = useContext(SocketContext)
  const timeoutContext = useContext(TimeoutContext)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    props.userLogin(
      credentials.username.value,
      credentials.password.value,
      socketContext.createSocket,
      () => history.push('/'),
      timeoutContext.createLogoutTimer
    )
    credentials.password.reset()
    credentials.username.reset()
  }

  return (
    <LoginFormComponent loading={props.user.loading} loginHandler={onSubmit} credentials={credentials}/>
  )
}

export default connector(LoginFormContainer)