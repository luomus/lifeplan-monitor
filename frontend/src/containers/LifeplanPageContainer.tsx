import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { ModalParamsType } from '../components/ConfirmationModalComponent'
import LifeplanPageComponent from '../components/LIfeplanPageComponent'
import LoadingOverlayComponent from '../components/LoadingOverlayComponent'
import { RootState, fetchLifeplanData, resetActivity } from '../stores'

const mapStateToProps = (state: RootState) => {
  const { user, lifeplan } = state

  return {
    user,
    lifeplan
  }
}

const mapDispatchToProps = {
  fetchLifeplanData,
  resetActivity
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

const LifeplanPageContainer = (props: Props): JSX.Element => {
  useEffect(() => {
    props.fetchLifeplanData()
  }, [])

  const [ show, setShow ] = useState<boolean>(false)
  const [ body, setBody ] = useState<string>('')
  const [ resetTarget, setResetTarget ] = useState<number | null>(null)

  const onResetButton = (id: number) => {
    setResetTarget(id)
    setBody(`Are you certain that you wish to continue to reset activity ${id} to unprocessed state, and that it's resource path is set correctly in Lifeplan backend.`)
    setShow(true)
  }

  const onReset = () => {
    props.resetActivity(resetTarget)
    setResetTarget(null)
    setShow(false)
  }

  const resetModalParams: ModalParamsType = {
    onLeft: () => onReset(),
    onRight: () => setShow(false),
    leftLabel: 'Reset',
    rightLabel: 'Cancel',
    leftVariant: 'danger',
    rightVariant: 'primary',
    label: 'Reset Activity',
    body: body,
    show: show
  }

  return (
    <LoadingOverlayComponent loading={props.lifeplan.loading}>
      <LifeplanPageComponent
        activities={props.lifeplan.data?.activities}
        stats={props.lifeplan.data?.count}
        onResetButton={onResetButton}
        resetModalParams={resetModalParams}
      />
    </LoadingOverlayComponent>
  )
}

export default connector(LifeplanPageContainer)