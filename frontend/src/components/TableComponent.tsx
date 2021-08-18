/* eslint-disable react/display-name */
import React, { forwardRef } from 'react'
import {
  ArrowDownward,
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
} from '@material-ui/icons'
import MaterialTable, { Icons } from '@material-table/core'

interface Props {
  columns: any[],
  data: any[],
  rowStyle: Record<string, any> | (() => Record<string, any>),
  detailPanel?: (rowData: any) => JSX.Element,
  pageSize?: number,
  pageSizeOptions?: number[]
}

const TableComponent = (props: Props): JSX.Element => {

  const tableIcons: Icons = {
    DetailPanel: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronLeft {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ArrowDownward {...props} ref={ref} />)
  }

  return (
    <MaterialTable
      columns={props.columns}
      data={props.data}
      icons={tableIcons}
      options={{
        search: false,
        showTitle: false,
        toolbar: false,
        padding: 'dense',
        pageSize: props.pageSize || 5,
        pageSizeOptions: props.pageSizeOptions,
        rowStyle: props.rowStyle,
      }}
      detailPanel={props.detailPanel}
    />
  )
}

export default TableComponent