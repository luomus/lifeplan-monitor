import React from 'react'
import { Container, Tab, Tabs } from 'react-bootstrap'
import { ActivityType } from '../stores/middlesoftware/types'
import ActivityTableComponent from './ActivityTableComponent'
import ConfirmationModalComponent, { ModalParamsType } from './ConfirmationModalComponent'
import StatsComponent from './StatsComponent'

interface Props {
  activities: ActivityType[],
  stats: Record<string, any> | null,
  onResetButton: (id: number) => void,
  resetModalParams: ModalParamsType
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
            <ActivityTableComponent activities={props.activities ? props.activities : []} onResetButton={props.onResetButton}/>
          </Tab>
        </Tabs>
      </div>
      <ConfirmationModalComponent modalParams={props.resetModalParams}/>
    </Container>
  )
}

export default LifeplanPageComponent