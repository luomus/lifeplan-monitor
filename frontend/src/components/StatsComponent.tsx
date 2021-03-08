import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { statusDict } from '../statusDict'
type Props = {
  stats: Record<string, any>,
  title: string
}

const StatsComponent = ({ stats, title }: Props): JSX.Element => {

  const formatter = (key: string, data: string | number) => {
    if (key !== 'activity.averagerate') {
      return data
    }

    if (typeof data !== 'number') {
      return data
    }

    const dataInSec = data * 1000

    if (dataInSec / 10 ** 9 > 1.0) {
      return `${(dataInSec / 10 ** 9).toFixed(2)} GB/s`
    } else if (dataInSec / 10 ** 6 > 1.0) {
      return `${(dataInSec / 10 ** 6).toFixed(2)} MB/s`
    } else if (dataInSec / 10 ** 3 > 1.0) {
      return `${(dataInSec / 10 ** 3).toFixed(2)} kB/s`
    } else {
      return `${dataInSec.toFixed(2)} B/s`
    }
  }

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
                  <Col md={6}>{statusDict[key]}:</Col><Col md={6}>{formatter(key, stats[key])}</Col>
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