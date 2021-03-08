import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export interface ModalParamsType {
  onLeft: () => void,
  onRight: () => void,
  leftLabel: string,
  rightLabel: string,
  leftVariant: string,
  rightVariant: string,
  label: string,
  body: string,
  show: any
}

interface PropsType {
  modalParams: ModalParamsType
}

const ConfirmationModalComponent = (props: PropsType): JSX.Element => {
  const { onLeft, onRight, leftLabel, rightLabel, leftVariant, rightVariant, label, body, show } = props.modalParams

  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>
          {label}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
      <Modal.Footer>
        <Button variant={leftVariant} onClick={onLeft}>
          {leftLabel}
        </Button>
        <Button variant={rightVariant} onClick={onRight}>
          {rightLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmationModalComponent