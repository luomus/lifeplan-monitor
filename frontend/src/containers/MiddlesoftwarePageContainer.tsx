import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../stores'
import MiddlesoftwarePageComponent from '../components/MiddlesoftwarePageComponent'

const mapStateToProps = (state: RootState) => {
  const { user, middlesoftware } = state

  return {
    user,
    middlesoftware
  }
}

const connector = connect(
  mapStateToProps
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
        'activity.duplicates': 0
      }
    }

    props.middlesoftware.instances.forEach(instance => {
      stats.instances[instance.status]++

      instance.activities.forEach(activity => {
        if (!activities.find(foundActivity => foundActivity.id === activity.id)) {
          stats.activities[activity.status]++

          activities.push(activity)
        } else {
          stats.activities['activity.duplicates']++
        }
      })
    })

    return { activities, stats }
  }

  const { activities, stats } = initPageData()

  return (
    <MiddlesoftwarePageComponent instances={props.middlesoftware.instances} activities={activities} stats={stats}/>
  )
}

export default connector(MiddlesoftwarePageContainer)