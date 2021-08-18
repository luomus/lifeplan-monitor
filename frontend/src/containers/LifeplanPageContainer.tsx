import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { ModalParamsType } from '../components/ConfirmationModalComponent'
import LifeplanPageComponent from '../components/LIfeplanPageComponent'
import LoadingOverlayComponent from '../components/LoadingOverlayComponent'
import useField from '../hooks/fieldHook'
import { RootState, fetchLifeplanData, resetActivity, ActivityType } from '../stores'

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
  const initPageData = () => {
    const newActivities = props.lifeplan.data.activities.filter(activity => {
      let include = true

      if (idField.value.length >= 3 && !(activity.id.toString().includes(idField.value) || activity.uuid.includes(idField.value))) {
        include = false
      }

      if (statusField.value !== '' && activity.status !== statusField.value) {
        include = false
      }

      return include
    })

    return newActivities
  }

  const [ show, setShow ] = useState<boolean>(false)
  const [ body, setBody ] = useState<string>('')
  const [ resetTarget, setResetTarget ] = useState<number | null>(null)
  const [ activities, setActivities ] = useState<ActivityType[]>([])
  const idField = useField('text')
  const statusField = useField('text')

  useEffect(() => {
    props.fetchLifeplanData()
  }, [])

  useEffect(() => {
    setActivities(initPageData())
  }, [props.lifeplan, idField.value, statusField.value])



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
        activities={activities}
        stats={props.lifeplan.data?.count}
        onResetButton={onResetButton}
        resetModalParams={resetModalParams}
        idField={idField}
        statusField={statusField}
      />
    </LoadingOverlayComponent>
  )
}

export default connector(LifeplanPageContainer)