import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../stores'
import MiddlesoftwarePageComponent from '../components/MiddlesoftwarePageComponent'
import { resetActivity, stopInstance } from '../stores'
import { ModalParamsType } from '../components/ConfirmationModalComponent'
import LoadingOverlayComponent from '../components/LoadingOverlayComponent'
const mapStateToProps = (state: RootState) => {
  const { user, middlesoftware } = state

  return {
    user,
    middlesoftware
  }
}

const mapDispatchToProps = {
  resetActivity,
  stopInstance
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

const MiddlesoftwarePageContainer = (props: Props): JSX.Element => {
  const initPageData = () => {
    const activities = []
    const stats = {
      instances: {
        'instance.status.0': 0,
        'instance.status.1': 0,
        'instance.status.2': 0,
        'instance.status.3': 0
      },
      activities: {
        'activity.status.0': 0,
        'activity.status.1': 0,
        'activity.status.2': 0,
        'activity.status.3': 0,
        'activity.status.4': 0,
        'activity.duplicates': 0,
        'activity.averagerate': 0.0 //byte/ms
      }
    }

    let counter = 0

    props.middlesoftware.instances.forEach(instance => {
      stats.instances[instance.status]++

      instance.activities.forEach(activity => {
        if (!activities.find(foundActivity => foundActivity.id === activity.id)) {
          stats.activities[activity.status]++

          if (activity.status === 'activity.status.3' && activity.totalSize > 0.0 && activity.duration > 0.0) {
            stats.activities['activity.averagerate'] += activity.totalSize / activity.duration
            counter++
          }

          activities.push(activity)
        } else {
          stats.activities['activity.duplicates']++
        }
      })
    })

    if (counter > 0) {
      stats.activities['activity.averagerate'] /= counter
    }

    return { activities, stats }
  }

  const { activities, stats } = initPageData()
  const [ resetShow, setResetShow ] = useState<boolean>(false)
  const [ resetBody, setResetBody ] = useState<string>('')
  const [ resetTarget, setResetTarget ] = useState<number | null>(null)
  const [ stopShow, setStopShow ] = useState<boolean>(false)
  const [ stopBody, setStopBody ] = useState<string>('')
  const [ stopTarget, setStopTarget ] = useState<string | null>(null)

  const onStopButton = (id: string) => {
    setStopTarget(id)
    setStopBody(`Are you certain that you wish to continue to mark instance ${id} as stopped and reset any in progres activities processed by it, and that it has been stopped on RAhti?`)
    setStopShow(true)
  }

  const onStop = () => {
    props.stopInstance(stopTarget)
    setStopTarget(null)
    setStopShow(false)
  }

  const stopModalParams: ModalParamsType = {
    onLeft: () => onStop(),
    onRight: () => setStopShow(false),
    leftLabel: 'Stop',
    rightLabel: 'Cancel',
    leftVariant: 'danger',
    rightVariant: 'primary',
    label: 'Set instance as stopped',
    body: stopBody,
    show: stopShow
  }


  const onResetButton = (id: number) => {
    setResetTarget(id)
    setResetBody(`Are you certain that you wish to continue to reset activity ${id} to unprocessed state, and that it's resource path is set correctly in Lifeplan backend?`)
    setResetShow(true)
  }

  const onReset = () => {
    props.resetActivity(resetTarget)
    setResetTarget(null)
    setResetShow(false)
  }

  const resetModalParams: ModalParamsType = {
    onLeft: () => onReset(),
    onRight: () => setResetShow(false),
    leftLabel: 'Reset',
    rightLabel: 'Cancel',
    leftVariant: 'danger',
    rightVariant: 'primary',
    label: 'Reset Activity',
    body: resetBody,
    show: resetShow
  }

  return (
    <LoadingOverlayComponent loading={props.middlesoftware.loading}>
      <MiddlesoftwarePageComponent
        instances={props.middlesoftware.instances}
        activities={activities}
        stats={stats}
        onStopButton={onStopButton}
        stopModalParams={stopModalParams}
        onResetButton={onResetButton}
        resetModalParams={resetModalParams}
      />
    </LoadingOverlayComponent>
  )
}

export default connector(MiddlesoftwarePageContainer)