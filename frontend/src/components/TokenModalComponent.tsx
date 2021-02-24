import React, { useState } from 'react'
import { Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap'
import copy from 'copy-to-clipboard'
import { Clipboard } from 'react-bootstrap-icons'

interface Props {
  token: string,
  setToken: (value: string) => void
}

const TokenModalComponent = (props: Props): JSX.Element => {
  const [ copied, setCopied ] = useState<boolean>(false)
  let interval

  const onClick = () => {
    copy(props.token)
    props.setToken('')
    setCopied(true)

    interval = setInterval(() => {
      setCopied(false)
    }, 5000)
  }

  const onHide = () => {
    props.setToken('')
    setCopied(false)

    if (interval) {
      clearInterval(interval)
    }
  }

  return (
    <Modal onHide={onHide} show={props.token !== ''}>
      <Modal.Body>
        {copied ? <Alert variant={'success'}>Token copied to clipboard</Alert> : null}
        <p>
          Copy the api token from beneath, token will not be saved afterwards.
        </p>
        <Form>
          <InputGroup>
            <Form.Control type={'text'} placeholder={props.token} readOnly/>
            <InputGroup.Append>
              <Button onClick={onClick}>
                <Clipboard/>
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default TokenModalComponent
