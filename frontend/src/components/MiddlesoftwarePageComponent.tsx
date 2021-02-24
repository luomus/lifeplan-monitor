import React from 'react'
import { Container, Tab, Tabs } from 'react-bootstrap'
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
            <div style={{ margin: 10 }}>
              <StatsComponent title={'Instance statistics'} stats={props.stats.instances}/>
            </div>
            <div style={{ margin: 10 }}>
              <StatsComponent title={'Activity statistics'} stats={props.stats.activities}/>
            </div>
          </> :
          null
      }
      <div style={{ margin: 10 }}>
        <Tabs>
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