import React from 'react'
import { Button, Card } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import { TokenType } from '../stores/apiToken/types'

interface Props {
  tokens: TokenType[],
  deleletionHandler: (id: number) => void
}

const TokenTableComponent = (props: Props): JSX.Element => {

  const deletionButton = (cell, row) => {
    return (
      <Button onClick={() => props.deleletionHandler(row.id)}>DELETE</Button>
    )
  }

  const columns = [
    {
      dataField: 'tokenname',
      text: 'Token Name',
      sort: true,
      headerStyle: {
        width: '85%'
      }
    },
    {
      dataField: 'dummydata',
      isDummyField: true,
      formatter: deletionButton,
      headerStyle: {
        width: '15%'
      }
    },
  ]

  return (
    <Card style={{ width: '100%' }}>
      <Card.Body>
        <BootstrapTable
          bootstrap4
          striped
          condensed
          keyField='id'
          data={props.tokens}
          columns={columns}
        />
      </Card.Body>
    </Card>
  )
}

export default TokenTableComponent