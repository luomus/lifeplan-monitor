import React from 'react'
import { Container, Nav, Tab, Tabs } from 'react-bootstrap'
import { useFieldType } from '../hooks/fieldHook'
import { InstanceType } from '../stores'
import { ActivityType } from '../stores/middlesoftware/types'
import ActivityFilterComponent from './ActivityFilterComponent'
import ActivityTableComponent from './ActivityTableComponent'
import ConfirmationModalComponent, { ModalParamsType } from './ConfirmationModalComponent'
import InstanceTableComponent from './InstanceTableComponent'
import StatsComponent from './StatsComponent'

interface Props {
  instances: InstanceType[],
  activities: ActivityType[],
  stats: Record<string, any> | null,
  onStopButton: (id: string) => void,
  stopModalParams: ModalParamsType,
  onResetButton: (id: number) => void,
  resetModalParams: ModalParamsType,
  idField: useFieldType,
  statusField: useFieldType
}

const MiddlesoftwarePage = (props: Props): JSX.Element => {
  return (
    <Container>
      {
        props.stats ?
          <>
            <StatsComponent title={'Instance statistics'} stats={props.stats.instances}/>
            <StatsComponent title={'Activity statistics'} stats={props.stats.activities}/>
          </> :
          null
      }
      <div className='mb-2'>
        <Tab.Container defaultActiveKey={'instances'}>
          <Nav variant='tabs'>
            <Nav.Item>
              <Nav.Link eventKey='instances'>Instances</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='activities'>Activities</Nav.Link>
            </Nav.Item>
          </Nav>
          <div className='my-2'>
            <ActivityFilterComponent type='middlesoftware' idField={props.idField} statusField={props.statusField}/>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey='instances' title='Instances'>
              <InstanceTableComponent instances={props.instances} onStopButton={props.onStopButton} onResetButton={props.onResetButton}/>
            </Tab.Pane>
            <Tab.Pane eventKey='activities' title='Activities'>
              <ActivityTableComponent activities={props.activities} onResetButton={props.onResetButton}/>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
      <ConfirmationModalComponent modalParams={props.resetModalParams}/>
      <ConfirmationModalComponent modalParams={props.stopModalParams}/>
    </Container>
  )
}

export default MiddlesoftwarePage