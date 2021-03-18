import React, { useState, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { ActivityType, InstanceType, RootState } from '../stores'
import MiddlesoftwarePageComponent from '../components/MiddlesoftwarePageComponent'
import { resetActivity, stopInstance } from '../stores'
import { ModalParamsType } from '../components/ConfirmationModalComponent'
import LoadingOverlayComponent from '../components/LoadingOverlayComponent'
import useField from '../hooks/fieldHook'

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
  const getInitState = () => {
    return {
      instances: [],
      activities: [],
      stats: {
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
    }
  }

  const initPageData = () => {
    //eslint-disable-next-line prefer-const
    let { instances, activities, stats } = getInitState()

    let counter = 0

    props.middlesoftware.instances.forEach(instance => {
      const newInstance = { ...instance }
      const newActivities = []

      //increase count for instance status
      stats.instances[instance.status]++

      if (instance.activities.length === 0 && (idField.value.length >= 3 || statusField.value !== '')) {
        return
      } else if (instance.activities.length === 0) {
        instances.push(newInstance)
      }

      instance.activities.forEach(activity => {
        //use filters on activities for both activities-list and per-instance activities
        let include = true

        if (idField.value.length >= 3 && !(activity.id.toString().includes(idField.value) || activity.uuid.includes(idField.value))) {
          include = false
        }

        if (statusField.value !== '' && activity.status !== statusField.value) {
          include = false
        }

        if (include) {
          newActivities.push(activity)
        }

        //if activity is not yet in list of all activities, add it, compute conts of different states,
        //and use it for computing average data transfer rate
        if (include && !activities.find(foundActivity => foundActivity.id === activity.id)) {
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

      //if instance had activities matching filters add it and its activities to instances list
      if (newActivities.length !== 0) {
        newInstance.activities = newActivities
        instances.push(newInstance)
      }
    })

    if (counter > 0) {
      stats.activities['activity.averagerate'] /= counter
    }

    return { instances, activities, stats }
  }

  const [ resetShow, setResetShow ] = useState<boolean>(false)
  const [ resetBody, setResetBody ] = useState<string>('')
  const [ resetTarget, setResetTarget ] = useState<number | null>(null)
  const [ stopShow, setStopShow ] = useState<boolean>(false)
  const [ stopBody, setStopBody ] = useState<string>('')
  const [ stopTarget, setStopTarget ] = useState<string | null>(null)
  const [ instances, setInstances ] = useState<InstanceType[]>([])
  const [ activities, setActivities ] = useState<ActivityType[]>([])
  const [ stats, setStats ] = useState({
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
  })
  const idField = useField('text')
  const statusField = useField('text')

  useEffect(() => {
    const { instances, activities, stats } = initPageData()
    setInstances(instances)
    setActivities(activities)
    setStats(stats)
  }, [props.middlesoftware, idField.value, statusField.value])

  //next 3 are for button and confirmation modal for changing instance state to finished
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

  //next 3 are for button and confirmation modal for resetting activity state
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
        instances={instances}
        activities={activities}
        stats={stats}
        onStopButton={onStopButton}
        stopModalParams={stopModalParams}
        onResetButton={onResetButton}
        resetModalParams={resetModalParams}
        idField={idField}
        statusField={statusField}
      />
    </LoadingOverlayComponent>
  )
}

export default connector(MiddlesoftwarePageContainer)