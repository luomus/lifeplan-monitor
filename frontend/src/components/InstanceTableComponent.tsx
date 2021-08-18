/* eslint-disable react/display-name */
import Moment from 'react-moment'
import React from 'react'
import { InstanceType } from '../stores'
import ActivityTableComponent from './ActivityTableComponent'
import {
  ArrowDownUp,
  XOctagonFill,
  QuestionCircleFill,
  ExclamationDiamondFill,
  CheckSquareFill,
} from 'react-bootstrap-icons'
import { Button } from 'react-bootstrap'
import TableComponent from './TableComponent'

interface Props {
  instances: InstanceType[],
  onStopButton: (id: string) => void,
  onResetButton: (id: number) => void
}

const InstanceTableComponent = (props: Props): JSX.Element => {
  const detailPanel = (rowData: InstanceType): JSX.Element => {
    return <ActivityTableComponent
      activities={rowData.activities}
      parentId={rowData.id}
      onResetButton={props.onResetButton}
    />
  }

  const dateFromNow = (rowData: InstanceType): JSX.Element | string => {
    if (rowData.updatedAt) {
      return <Moment fromNow>{rowData.updatedAt}</Moment>
    }

    return 'N/A'
  }

  const statusFormatter = (rowData: InstanceType) => {
    const size = 25

    switch (rowData.status) {
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

  const stopButton = (rowData: InstanceType): JSX.Element => {
    return (
      <>
        {
          rowData.status === 'instance.status.0' ?
            <Button onClick={() => props.onStopButton(rowData.id)} variant={'danger'} size='sm' style={{ width: '100%', padding: 5 }}>Set Stopped</Button> :
            null
        }
      </>
    )
  }

  const columns = [
    {
      field: 'status',
      title: 'Status',
      render: statusFormatter,
      width: '5%'
    },
    {
      field: 'id',
      title: 'ID',
      sorting: false,
      width: '35%'
    },
    {
      field: 'notes',
      title: 'Notes',
      sorting: false,
      width: '30%'
    },
    {
      field: 'updatedAt',
      title: 'Updated',
      render: dateFromNow,
      width: '15%'
    },
    {
      dataField: 'status',
      render: stopButton,
      width: '15%'
    },
  ]

  return (
    <TableComponent
      columns={columns}
      data={props.instances}
      rowStyle={{
        fontSize: 15
      }}
      detailPanel={detailPanel}
      pageSize={10}
      pageSizeOptions={[10, 20, 50, 100]}

    />
  )
}

export default InstanceTableComponent