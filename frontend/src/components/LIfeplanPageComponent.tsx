import React from 'react'
import { Container, Nav, Tab } from 'react-bootstrap'
import { useFieldType } from '../hooks/fieldHook'
import { ActivityType } from '../stores/middlesoftware/types'
import ActivityFilterComponent from './ActivityFilterComponent'
import ActivityTableComponent from './ActivityTableComponent'
import ConfirmationModalComponent, { ModalParamsType } from './ConfirmationModalComponent'
import StatsComponent from './StatsComponent'

interface Props {
  activities: ActivityType[],
  stats: Record<string, any> | null,
  onResetButton: (id: number) => void,
  resetModalParams: ModalParamsType,
  idField: useFieldType,
  statusField: useFieldType
}

const LifeplanPageComponent = (props: Props): JSX.Element => {
  return (
    <Container>
      {
        props.stats ?
          <StatsComponent title={'Lifeplan statistics'} stats={props.stats}/> :
          null
      }
      <div className='mb-2'>
        <Tab.Container defaultActiveKey={'activities'}>
          <Nav variant='tabs'>
            <Nav.Item>
              <Nav.Link eventKey='activities'>Activities</Nav.Link>
            </Nav.Item>
          </Nav>
          <div className='my-2'>
            <ActivityFilterComponent type='lifeplan' idField={props.idField} statusField={props.statusField}/>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey='activities' title='Activities'>
              <ActivityTableComponent activities={props.activities} onResetButton={props.onResetButton}/>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
      <ConfirmationModalComponent modalParams={props.resetModalParams}/>
    </Container>
  )
}

export default LifeplanPageComponent