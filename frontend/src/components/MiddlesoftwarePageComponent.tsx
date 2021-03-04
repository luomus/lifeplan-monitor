import React from 'react'
import { Card, Container, Nav, Tab, Tabs } from 'react-bootstrap'
import { InstanceType } from '../stores'
import { ActivityType } from '../stores/middlesoftware/types'
import ActivityTableComponent from './ActivityTableComponent'
import InstanceTableComponent from './InstanceTableComponent'
import StatsComponent from './StatsComponent'

interface Props {
  instances: InstanceType[],
  activities: ActivityType[],
  stats: Record<string, any> | null
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
            <InstanceTableComponent instances={props.instances}/>
          </Tab>
          <Tab eventKey='activities' title='Activities'>
            <ActivityTableComponent activities={props.activities}/>
          </Tab>
        </Tabs>
      </div>
    </Container>
  )
}

export default MiddlesoftwarePage