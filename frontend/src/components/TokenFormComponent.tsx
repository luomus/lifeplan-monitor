import { useFieldType } from '../hooks/fieldHook'
import React from 'react'
import { Button, Card, Form, FormControlProps, Spinner } from 'react-bootstrap'

interface PropsType {
  loading: boolean,
  newTokenHandler: (event: React.FormEvent<HTMLFormElement>) => void,
  tokenField: useFieldType,
}

const TokenFormComponent = (props: PropsType): JSX.Element => {
  const destruct = (target: useFieldType): FormControlProps => {
    const { reset, ...rest } = target

    return rest
  }

  return (
    <Card style={{ width: '100%', margin: 10 }}>
      <Card.Header>
        Add New API Token
      </Card.Header>
      <Card.Body>
        <Form onSubmit={props.newTokenHandler}>
          <Form.Group>
            <Form.Control required placeholder={'Token name'} {...destruct(props.tokenField)}/>
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
  )
}

export default TokenFormComponent