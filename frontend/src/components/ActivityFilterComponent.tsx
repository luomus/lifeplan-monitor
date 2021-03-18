import React from 'react'
import { Col, Form, FormControlProps, Row } from 'react-bootstrap'
import { useFieldType } from '../hooks/fieldHook'
import { statusDict } from '../statusDict'

interface PropsType {
  type: string,
  idField: useFieldType,
  statusField: useFieldType
}

const ActivityFilterComponent = (props: PropsType): JSX.Element => {
  const destruct = (target: useFieldType): FormControlProps => {
    const { reset, ...rest } = target

    return rest
  }

  return (
    <Form>
      <Row>
        <Col md={8}>
          <Form.Control placeholder='Activity Id or Uuid...' {...destruct(props.idField)}/>
        </Col>
        <Col md={4}>
          {props.type === 'middlesoftware' ?
            <Form.Control as='select' {...destruct(props.statusField)} custom>
              <option value={''}>{'Activity status...'}</option>
              <option value={'activity.status.0'}>{statusDict['activity.status.0']}</option>
              <option value={'activity.status.1'}>{statusDict['activity.status.1']}</option>
              <option value={'activity.status.2'}>{statusDict['activity.status.2']}</option>
              <option value={'activity.status.3'}>{statusDict['activity.status.3']}</option>
              <option value={'activity.status.4'}>{statusDict['activity.status.4']}</option>
            </Form.Control> :
            <Form.Control as='select' {...destruct(props.statusField)} custom>
              <option value={''}>{'Activity status...'}</option>
              <option value={'activity.lifeplan.status.1'}>{statusDict['activity.lifeplan.status.1']}</option>
              <option value={'activity.lifeplan.status.3'}>{statusDict['activity.lifeplan.status.3']}</option>
            </Form.Control>
          }
        </Col>
      </Row>
    </Form>
  )
}

export default ActivityFilterComponent