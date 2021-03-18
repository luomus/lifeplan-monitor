import Moment from 'react-moment'
import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import PaginationFactory from 'react-bootstrap-table2-paginator'
import { InstanceType } from '../stores'
import ActivityTableComponent from './ActivityTableComponent'
import {
  ArrowDownUp,
  XOctagonFill,
  QuestionCircleFill,
  ExclamationDiamondFill,
  CheckSquareFill,
  DashSquareFill,
  PlusSquareFill
} from 'react-bootstrap-icons'
import { Button } from 'react-bootstrap'

interface Props {
  instances: InstanceType[],
  onStopButton: (id: string) => void,
  onResetButton: (id: number) => void
}

const InstanceTableComponent = (props: Props): JSX.Element => {
  const expandRow = {
    //eslint-disable-next-line react/display-name
    renderer: (row: InstanceType) => <ActivityTableComponent activities={row.activities} parentId={row.id} onResetButton={props.onResetButton}/>,
    showExpandColumn: true,
    // eslint-disable-next-line react/display-name
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <DashSquareFill color='gray'/>
      }

      return <PlusSquareFill color='gray'/>
    },
    // eslint-disable-next-line react/display-name
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return <DashSquareFill color='gray'/>
      }

      return <PlusSquareFill color='gray'/>
    }
  }

  const dateFromNow = (cell: string): JSX.Element | string => {
    if (cell) {
      return <Moment fromNow>{cell}</Moment>
    }

    return 'N/A'
  }

  const statusFormatter = (cell: string) => {
    const size = 25

    switch (cell) {
      case 'instance.status.0':
        return <ArrowDownUp size={size} color='green'/>
      case 'instance.status.1':
        return <CheckSquareFill size={size} color='green'/>
      case 'instance.status.2':
        return <ExclamationDiamondFill size={size} color='orange'/>
      case 'instance.status.3':
        return <XOctagonFill size={size} color='red'/>
      default:
        return <QuestionCircleFill size={size} color='black'/>
    }
  }

  const stopButton = (cell, row): JSX.Element => {
    return (
      <>
        {
          row.status === 'instance.status.0' ?
            <Button onClick={() => props.onStopButton(row.id)} variant={'danger'} size='sm' style={{ width: '100%', padding: 5 }}>Set Stopped</Button> :
            null
        }
      </>
    )
  }

  const columns = [
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      formatter: statusFormatter,
      headerStyle: {
        width: '10%'
      },
      style: {
        fontSize: '15px',
      }
    },
    {
      dataField: 'id',
      text: 'ID',
      sort: true,
      headerStyle: {
        width: '30%'
      },
      style: {
        fontSize: '15px',
      }
    },
    {
      dataField: 'notes',
      text: 'Notes',
      headerStyle: {
        width: '35%'
      },
      style: {
        fontSize: '15px',
      }
    },
    {
      dataField: 'updatedAt',
      text: 'Updated',
      sort: true,
      formatter: dateFromNow,
      headerStyle: {
        width: '15%',
      },
      style: {
        fontSize: '15px',
      }
    },
    {
      dataField: 'status',
      isDummyField: true,
      formatter: stopButton,
      headerStyle: {
        width: '10%'
      }
    },
  ]

  const pagination = PaginationFactory({
    showTotal: true
  })

  return (
    <BootstrapTable
      bootstrap4
      striped
      condensed
      keyField='id'
      data={props.instances}
      columns={columns}
      expandRow={expandRow}
      pagination={pagination}
    />
  )
}

export default InstanceTableComponent