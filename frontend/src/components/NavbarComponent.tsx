import React from 'react'
import { Button, Form, Nav, Navbar } from 'react-bootstrap'
import { connect, ConnectedProps } from 'react-redux'
import { RootState, userLogout } from '../stores'
import { LinkContainer } from 'react-router-bootstrap'
import { useHistory } from 'react-router-dom'

const mapStateToProps = (state: RootState) => {
  const { user } = state

  return {
    user
  }
}

const mapDispatchToProps = {
  userLogout,
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

const NavbarComponent = (props: Props): JSX.Element => {
  const history = useHistory()

  return (
    <Navbar bg='primary' variant='dark'>
      <LinkContainer to='/'>
        <Navbar.Brand>Middlesoftware Monitor</Navbar.Brand>
      </LinkContainer>
      { props.user.userData ?
        <Nav className={'mr-auto'}>
          <LinkContainer exact to='/'>
            <Nav.Link>Middlesoftware</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/lifeplan'>
            <Nav.Link>Lifeplan</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/admin'>
            <Nav.Link>Admin</Nav.Link>
          </LinkContainer>
        </Nav>
        : null
      }
      {props.user.userData ?
        <Nav>
          <Navbar.Text style={{ paddingRight: 10, color: 'white' }}>
            Signed in as: {props.user.userData.username}
          </Navbar.Text>
          <Form inline>
            <Button variant={'danger'} onClick={() => history.push('/logout')}>Logout</Button>
          </Form>
        </Nav> :
        null
      }
    </Navbar>
  )
}

export default connector(NavbarComponent)
