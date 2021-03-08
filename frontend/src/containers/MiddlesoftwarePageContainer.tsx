import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../stores'
import MiddlesoftwarePageComponent from '../components/MiddlesoftwarePageComponent'
import { resetActivity } from '../stores'
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
  resetActivity
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

    props.middlesoftware.instances.forEach(instance => {
      stats.instances[instance.status]++

      instance.activities.forEach(activity => {
        if (!activities.find(foundActivity => foundActivity.id === activity.id)) {
          stats.activities[activity.status]++

          if (activity.status === 'activity.status.3' && activity.totalSize > 0.0 && activity.duration > 0.0) {
            stats.activities['activity.averagerate'] += activity.totalSize / activity.duration
          }

          activities.push(activity)
        } else {
          stats.activities['activity.duplicates']++
        }
      })
    })

    if (activities.length > 0) {
      stats.activities['activity.averagerate'] /= activities.length
    }

    return { activities, stats }
  }

  const { activities, stats } = initPageData()
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
    <LoadingOverlayComponent loading={props.middlesoftware.loading}>
      <MiddlesoftwarePageComponent instances={props.middlesoftware.instances} activities={activities} stats={stats} onResetButton={onResetButton} resetModalParams={resetModalParams}/>
    </LoadingOverlayComponent>
  )
}

export default connector(MiddlesoftwarePageContainer)