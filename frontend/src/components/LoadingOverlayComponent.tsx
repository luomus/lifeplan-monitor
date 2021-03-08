import React from 'react'
import { Spinner } from 'react-bootstrap'

interface PropsType {
  loading: boolean,
  children?: JSX.Element | JSX.Element[]
}
const LoadingOverlayComponent = (props: PropsType): JSX.Element => {
  if (props.loading) {
    return (
      <>
        <Spinner animation={'border'} variant={'primary'} style={{ position: 'absolute', left: '50vw', top: '50vh' }}/>
        <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
          {props.children}
        </div>
      </>
    )
  }

  return (
    <>
      {props.children}
    </>
  )
}

export default LoadingOverlayComponent
