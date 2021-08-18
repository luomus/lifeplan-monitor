import Moment from 'react-moment'
import React from 'react'
import { ActivityType } from '../stores/middlesoftware/types'
import {
  Hourglass,
  XOctagonFill,
  ArrowDownUp,
  CheckSquareFill,
  QuestionCircleFill,
  Trash
} from 'react-bootstrap-icons'
import { Button } from 'react-bootstrap'
import moment from 'moment'
import TableComponent from './TableComponent'

interface Props {
  parentId?: string,
  activities: ActivityType[],
  onResetButton: (id: number) => void
}

const ActivityTableComponent = (props: Props): JSX.Element => {
  const dateFromNow = (rowData: ActivityType): JSX.Element | string => {
    if (rowData.updatedAt) {
      return <Moment fromNow>{rowData.updatedAt}</Moment>
    }

    return 'N/A'
  }

  const progressFormatter = (rowData: ActivityType): string => {
    if (rowData.currentSize && rowData.totalSize > 0) {
      return `${(rowData.currentSize / rowData.totalSize * 100).toFixed(1)}%`
    }

    return 'N/A'
  }

  const sizeFormatter = (rowData: ActivityType): string => {
    const size = rowData.totalSize

    if (size) {
      if (size / 10 ** 12 >= 1.0) {
        return `${(size / 10 ** 12).toFixed(1)}TB`
      } else if (size / 10 ** 9 >= 1.0) {
        return `${(size / 10 ** 9).toFixed(1)}GB`
      } else if (size / 10 ** 6 >= 1.0) {
        return `${(size / 10 ** 6).toFixed(1)}MB`
      }  else if (size / 10 ** 3 >= 1.0) {
        return `${(size / 10 ** 3).toFixed(1)}kB`
      } else {
        return `${size}B`
      }
    }

    return 'N/A'
  }

  const durationFormatter = (rowData: ActivityType): string => {
    if (rowData.duration) {
      return Math.floor(moment.duration(rowData.duration).asHours()) + moment.utc(rowData.duration).format(':mm:ss')
    }

    return 'N/A'
  }

  const statusFormatter = (rowData: ActivityType): JSX.Element => {
    const size = 25

    switch (rowData.status) {
      case 'activity.status.0':
        return <Hourglass size={size} color='gray'/>
      case 'activity.status.1':
      case 'activity.lifeplan.status.1':
        return <ArrowDownUp size={size} color='green'/>
      case 'activity.status.2':
        return <Trash size={size} color='green'/>
      case 'activity.status.3':
        return <CheckSquareFill size={size} color='green'/>
      case 'activity.lifeplan.status.3':
      case 'activity.status.4':
        return <XOctagonFill size={size} color='red'/>
      default:
        return <QuestionCircleFill size={size} color='black'/>
    }
  }

  const resetButton = (rowData: ActivityType): JSX.Element => {
    return (
      <>
        {
          rowData.status !== 'activity.status.0' ?
            <Button disabled={props.parentId && props.parentId !== rowData.processedBy} onClick={() => props.onResetButton(rowData.id)} variant={'danger'} size='sm' style={{ width: '100%', padding: 5 }}>Reset</Button> :
            null
        }
      </>
    )
  }

  const columns = [
    {
      field: 'status',
      title: 'State',
      render: statusFormatter,
      width: '6%'
    },
    {
      field: 'currentSize',
      title: 'Prog.',
      sorting: false,
      render: progressFormatter,
      width: '6.5%'
    },
    {
      field: 'id',
      title: 'ID',
      width: '5%'
    },
    {
      field: 'uuid',
      title: 'UUID',
      sorting: false,
      width: '30%'
    },
    {
      field: 'notes',
      title: 'Notes',
      sorting: false,
      width: '25%'
    },
    {
      field: 'updatedAt',
      title: 'Updated',
      render: dateFromNow,
      width: '15%',
    },
    {
      field: 'totalSize',
      title: 'Size',
      sorting: false,
      render: sizeFormatter,
      width: '7.5%'
    },
    {
      field: 'duration',
      title: 'Duration',
      sorting: false,
      render: durationFormatter,
      width: '7.5%'
    },
    {
      field: 'processedBy',
      sorting: false,
      render: resetButton,
      width: '7.5%'
    },
  ]

  const rowStyle = (rowData: ActivityType): any => {
    if (rowData.status !== 'activity.status.0' && props.parentId && rowData.processedBy !== props.parentId) {
      return {
        fontSize: '15px',
        opacity: 0.25
      }
    } else {
      return { fontSize: '15px' }
    }
  }

  return (
    <TableComponent
      columns={columns}
      data={props.activities}
      rowStyle={rowStyle}
    />
  )
}

export default ActivityTableComponent