import React from 'react'
import { Container, Tab, Tabs } from 'react-bootstrap'
import { ActivityType } from '../stores/middlesoftware/types'
import ActivityTableComponent from './ActivityTableComponent'
import StatsComponent from './StatsComponent'

interface Props {
  activities: ActivityType[],
  stats: Record<string, any> | null
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
        <Tabs>
          <Tab eventKey='activities' title='Activities'>
            <ActivityTableComponent activities={props.activities ? props.activities : []}/>
          </Tab>
        </Tabs>
      </div>
    </Container>
  )
}

export default LifeplanPageComponent