import React from 'react'
import { Button } from 'react-bootstrap'
import { TokenType } from '../stores/apiToken/types'
import TableComponent from './TableComponent'

interface Props {
  tokens: TokenType[],
  deleletionHandler: (id: number) => void
}

const TokenTableComponent = (props: Props): JSX.Element => {

  const deletionButton = (rowData: TokenType) => {
    return (
      <Button onClick={() => props.deleletionHandler(rowData.id)} variant={'danger'}>DELETE</Button>
    )
  }

  const columns = [
    {
      field: 'tokenname',
      title: 'Token Name',
      width: '85%'
    },
    {
      dataField: 'id',
      sorting: false,
      render: deletionButton,
      width: '15%'
    },
  ]

  return (
    <div className='mb-2'>
      <TableComponent
        columns={columns}
        data={props.tokens}
        rowStyle={undefined}
      />
    </div>
  )
}

export default TokenTableComponent