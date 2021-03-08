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
  CheckSquareFill
} from 'react-bootstrap-icons'

interface Props {
  instances: InstanceType[],
  onResetButton: (id: number) => void
}

const InstanceTableComponent = (props: Props): JSX.Element => {
  const expandRow = {
    //eslint-disable-next-line react/display-name
    renderer: (row: InstanceType) => <ActivityTableComponent activities={row.activities} parentId={row.id} onResetButton={props.onResetButton}/>
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
        width: '40%'
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
        width: '20%',
      },
      style: {
        fontSize: '15px',
      }
    }
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