import Moment from 'react-moment'
import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { ActivityType } from '../stores/middlesoftware/types'
import {
  Hourglass,
  XOctagonFill,
  ArrowDownUp,
  CheckSquareFill,
  QuestionCircleFill
} from 'react-bootstrap-icons'

interface Props {
  parentId?: string,
  activities: ActivityType[]
}

const ActivityTableComponent = (props: Props): JSX.Element => {
  const dateFromNow = (cell: string | null): JSX.Element | string => {
    if (cell) {
      return <Moment fromNow>{cell}</Moment>
    }

    return 'N/A'
  }

  const progressFormatter = (cell: number | null): string => {
    if (cell) {
      return `${cell.toFixed(1)}%`
    }

    return 'N/A'
  }

  const statusFormatter = (cell: string): JSX.Element => {
    const size = 25

    switch (cell) {
      case 'activity.status.0':
        return <Hourglass size={size} color='gray'/>
      case 'activity.status.1':
      case 'activity.lifeplan.status.1':
        return <ArrowDownUp size={size} color='green'/>
      case 'activity.status.2':
      case 'activity.status.3':
        return <CheckSquareFill size={size} color='green'/>
      case 'activity.lifeplan.status.3':
      case 'activity.status.4':
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
      }
    },
    {
      dataField: 'progress',
      text: 'Progress',
      formatter: progressFormatter,
      headerStyle: {
        width: '10%'
      }
    },
    {
      dataField: 'id',
      text: 'ID',
      sort: true,
      headerStyle: {
        width: '10%'
      }
    },
    {
      dataField: 'uuid',
      text: 'UUID',
      sort: true,
      headerStyle: {
        width: '35%'
      }
    },
    {
      dataField: 'notes',
      text: 'Notes',
      headerStyle: {
        width: '30%'
      }
    },
    {
      dataField: 'updatedAt',
      text: 'Updated',
      sort: true,
      formatter: dateFromNow,
      headerStyle: {
        width: '15%',
      }
    }
  ]

  const rowStyle = (row: ActivityType): any => {
    if (row.status !== 'activity.status.0' && props.parentId && row.processedBy !== props.parentId) {
      return { opacity: 0.25 }
    }
  }

  return (
    <BootstrapTable
      bootstrap4
      striped
      condensed
      keyField='id'
      data={props.activities}
      columns={columns}
      rowStyle={rowStyle}
    />
  )
}

export default ActivityTableComponent