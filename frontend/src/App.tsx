import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import LoginFormContainer from './containers/LoginPageContainer'
import { RootState } from './stores'
import MiddlesoftwarePageContainer from './containers/MiddlesoftwarePageContainer'
import LogoutPageContainer from './containers/LogoutPageContainer'
import { userLogout, setInstances } from './stores'
import ErrorComponent from './components/ErrorComponent'
import NavbarComponent from './components/NavbarComponent'
import AdminPageContainer from './containers/AdminPageContainer'
import LifeplanPageContainer from './containers/LifeplanPageContainer'
import SocketManager from './providers/SocketManager'
import UserTimeoutManager from './providers/UserTimeoutManager'

const mapStateToProps = (state: RootState) => {
  const { user } = state

  return {
    user
  }
}

const mapDispatchToProps = {
  userLogout,
  setInstances
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

const  App = (props: Props) => {
  return (
    <BrowserRouter>
      <NavbarComponent/>
      <ErrorComponent/>
      <SocketManager>
        <UserTimeoutManager>
          <Switch>
            <Route path="/login">
              {props.user.userData ? <Redirect to='/'/> : <LoginFormContainer/>}
            </Route>
            <Route path='/logout'>
              <LogoutPageContainer/>
            </Route>
            <Route path='/admin'>
              {props.user.userData ? <AdminPageContainer/> : <Redirect to='/login'/>}
            </Route>
            <Route path='/lifeplan'>
              {props.user.userData ? <LifeplanPageContainer/> :  <Redirect to='/login'/>}
            </Route>
            <Route path="/">
              {props.user.userData ? <MiddlesoftwarePageContainer/> :  <Redirect to='/login'/>}
            </Route>
          </Switch>
        </UserTimeoutManager>
      </SocketManager>
    </BrowserRouter>
  )
}

export default connector(App)
