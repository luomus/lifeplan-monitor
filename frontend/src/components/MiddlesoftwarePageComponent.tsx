import React from 'react'
import { Container, Tab, Tabs } from 'react-bootstrap'
import { InstanceType } from '../stores'
import { ActivityType } from '../stores/middlesoftware/types'
import ActivityTableComponent from './ActivityTableComponent'
import ConfirmationModalComponent, { ModalParamsType } from './ConfirmationModalComponent'
import InstanceTableComponent from './InstanceTableComponent'
import StatsComponent from './StatsComponent'

interface Props {
  instances: InstanceType[],
  activities: ActivityType[],
  stats: Record<string, any> | null,
  onResetButton: (id: number) => void,
  resetModalParams: ModalParamsType
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
        <Tabs defaultActiveKey='instances'>
          <Tab eventKey='instances' title='Instances'>
            <InstanceTableComponent instances={props.instances} onResetButton={props.onResetButton}/>
          </Tab>
          <Tab eventKey='activities' title='Activities'>
            <ActivityTableComponent activities={props.activities} onResetButton={props.onResetButton}/>
          </Tab>
        </Tabs>
      </div>
      <ConfirmationModalComponent modalParams={props.resetModalParams}/>
    </Container>
  )
}

export default MiddlesoftwarePage