import { useFieldType } from '../hooks/fieldHook'
import React from 'react'
import { Button, Card, Container, Form, FormControlProps, Spinner } from 'react-bootstrap'

interface PropsType {
  loading: boolean,
  loginHandler: (event: React.FormEvent<HTMLFormElement>) => void,
  credentials: {
    username: useFieldType,
    password: useFieldType
  }
}

const LoginFormComponent = (props: PropsType): JSX.Element => {
  const destruct = (target: useFieldType): FormControlProps => {
    const { reset, ...rest } = target

    return rest
  }

  return (
    <Container style={{
      height: '75vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card style={{ width: '50%' }}>
        <Card.Body>
          <Form onSubmit={props.loginHandler}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control required placeholder={'Username'} {...destruct(props.credentials.username)} disabled={props.loading}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control required placeholder={'Password'} {...destruct(props.credentials.password)} disabled={props.loading}/>
            </Form.Group>
            <Button type='submit' disabled={props.loading}>
              {props.loading ?
                <>
                  <Spinner animation={'border'} variant={'light'} size={'sm'} style={{ paddingRight: 5 }}/>
                  Loading...
                </> :
                <>Submit</>
              }
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default LoginFormComponent