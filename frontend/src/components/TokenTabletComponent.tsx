import React from 'react'
import { Button } from 'react-bootstrap'
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
    <div style={{ width: '100%', margin: 10 }}>
      <BootstrapTable
        bootstrap4
        striped
        condensed
        keyField='id'
        data={props.tokens}
        columns={columns}
      />
    </div>
  )
}

export default TokenTableComponent