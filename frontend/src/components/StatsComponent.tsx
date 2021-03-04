import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { statusDict } from '../statusDict'
type Props = {
  stats: Record<string, any>,
  title: string
}

const StatsComponent = ({ stats, title }: Props): JSX.Element => {
  return (
    <Card className='mb-2'>
      <Card.Header>
        {title}
      </Card.Header>
      <Card.Body>
        <Row>
          {Object.keys(stats).map(key => {
            return (
              <Col md={3} key={key}>
                <Row>
                  <Col md={8}>{statusDict[key]}:</Col><Col md={4}>{stats[key]}</Col>
                </Row>
              </Col>
            )
          })}
        </Row>
      </Card.Body>
    </Card>
  )
}

export default StatsComponent