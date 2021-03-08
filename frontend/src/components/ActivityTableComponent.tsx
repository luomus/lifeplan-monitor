import Moment from 'react-moment'
import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import PaginationFactory from 'react-bootstrap-table2-paginator'
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

interface Props {
  parentId?: string,
  activities: ActivityType[],
  onResetButton: (id: number) => void
}

const ActivityTableComponent = (props: Props): JSX.Element => {
  const dateFromNow = (cell: string | null): JSX.Element | string => {
    if (cell) {
      return <Moment fromNow>{cell}</Moment>
    }

    return 'N/A'
  }

  const progressFormatter = (cell, row): string => {
    if (row.currentSize && row.totalSize > 0) {
      return `${(row.currentSize / row.totalSize * 100).toFixed(1)}%`
    }

    return 'N/A'
  }

  const sizeFormatter = (cell: number | null): string => {
    if (cell) {
      if (cell / 10 ** 12 >= 1.0) {
        return `${(cell / 10 ** 12).toFixed(1)}TB`
      } else if (cell / 10 ** 9 >= 1.0) {
        return `${(cell / 10 ** 9).toFixed(1)}GB`
      } else if (cell / 10 ** 6 >= 1.0) {
        return `${(cell / 10 ** 6).toFixed(1)}MB`
      }  else if (cell / 10 ** 3 >= 1.0) {
        return `${(cell / 10 ** 3).toFixed(1)}kB`
      } else {
        return `${cell}B`
      }
    }

    return 'N/A'
  }

  const durationFormatter = (cell: number | null): string => {
    if (cell) {
      return Math.floor(moment.duration(cell).asHours()) + moment.utc(cell).format(':mm:ss')
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

  const resetButton = (cell, row): JSX.Element => {
    return (
      <>
        <Button onClick={() => props.onResetButton(row.id)} variant={'danger'} style={{ width: '100%', padding: 5 }}>Reset</Button>
      </>
    )
  }

  const columns = [
    {
      dataField: 'status',
      text: 'State',
      sort: true,
      formatter: statusFormatter,
      headerStyle: {
        width: '6%'
      }
    },
    {
      dataField: 'dummydata1',
      isDummyField: true,
      text: 'Prog.',
      formatter: progressFormatter,
      headerStyle: {
        width: '6.5%'
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
        width: '5%'
      },
      style: {
        fontSize: '15px',
      }
    },
    {
      dataField: 'uuid',
      text: 'UUID',
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
        width: '25%'
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
      dataField: 'totalSize',
      text: 'Size',
      formatter: sizeFormatter,
      headerStyle: {
        width: '7.5%'
      },
      style: {
        fontSize: '15px',
      }
    },
    {
      dataField: 'duration',
      text: 'Duration',
      formatter: durationFormatter,
      headerStyle: {
        width: '7.5%'
      },
      style: {
        fontSize: '15px',
      }
    },
    {
      dataField: 'dummydata2',
      isDummyField: true,
      formatter: resetButton,
      headerStyle: {
        width: '7.5%'
      }
    },
  ]

  const rowStyle = (row: ActivityType): any => {
    if (row.status !== 'activity.status.0' && props.parentId && row.processedBy !== props.parentId) {
      return { opacity: 0.25 }
    }
  }

  const pagination = PaginationFactory({
    showTotal: true
  })

  return (
    <BootstrapTable
      bootstrap4
      striped
      condensed
      keyField='id'
      data={props.activities}
      columns={columns}
      rowStyle={rowStyle}
      pagination={pagination}
    />
  )
}

export default ActivityTableComponent