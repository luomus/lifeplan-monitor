import React from 'react'
import { Spinner } from 'react-bootstrap'

interface PropsType {
  loading: boolean,
  children?: JSX.Element | JSX.Element[]
}
const LoadingOverlayComponent = (props: PropsType): JSX.Element => {
  return (
    <>
      {
        props.loading ?
          <Spinner animation={'border'} variant={'primary'} style={{ position: 'absolute', left: '50vw', top: '50vh' }}/> :
          null
      }
      <div style={props.loading ? { opacity: 0.5, pointerEvents: 'none' } : null}>
        {props.children}
      </div>
    </>
  )
}

export default LoadingOverlayComponent
