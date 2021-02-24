import { ThunkAction } from 'redux-thunk'
import { merge } from 'lodash'
import {
  ADD_INSTANCE,
  CLEAR_ERROR,
  CLEAR_INSTANCES,
  middlesoftwareActionTypes,
  InstanceType,
  SET_ERROR,
  SET_INSTANCES,
  ActivityType,
  ExtendedActivityType
} from './types'

export const setInstances = (instances: InstanceType[]): middlesoftwareActionTypes => {
  return {
    type: SET_INSTANCES,
    payload: instances
  }
}

export const addInstance = (instance: InstanceType): middlesoftwareActionTypes => {
  return {
    type: ADD_INSTANCE,
    payload: instance
  }
}

export const updateInstance = (updatedInstance: InstanceType): ThunkAction<void, any, null, middlesoftwareActionTypes> => {
  return (dispatch, getState) => {
    const { middlesoftware } = getState()

    const newInstances = middlesoftware.instances.map((instance: InstanceType) => {
      if (instance.id === updatedInstance.id) {
        return merge(instance, updatedInstance)
      } else {
        return instance
      }
    })

    dispatch(setInstances(newInstances))
  }
}

export const updateInstanceAndActivity = (updatedActivity: ExtendedActivityType): ThunkAction<void, any, null, middlesoftwareActionTypes> => {
  return (dispatch, getState) => {
    const { middlesoftware } = getState()

    const { instances, ...activity } = updatedActivity

    const newInstances = middlesoftware.instances.map((oldInstance: InstanceType) => {
      const idx = instances.findIndex(newInstance => newInstance.id === oldInstance.id)

      if (idx === -1) {
        return oldInstance
      }

      const oldActivities = oldInstance.activities
      const newActivities = oldActivities.map((oldActivity: ActivityType) => {
        if (oldActivity.id !== activity.id) {
          return oldActivity
        }

        return activity
      })

      return {
        ...instances[idx],
        activities: newActivities
      }
    })

    dispatch(setInstances(newInstances))
  }
}

export const deleteInstance = (id: string): ThunkAction<void, any, null, middlesoftwareActionTypes> => {
  return (dispatch, getState) => {
    const { middlesoftware } = getState()

    const newInstances = middlesoftware.instances.filter((instance: InstanceType) => {
      return instance.id !== id
    })

    dispatch(setInstances(newInstances))
  }
}

export const clearInstances = (): middlesoftwareActionTypes => {
  return {
    type: CLEAR_INSTANCES
  }
}

export const setMiddlesoftwareError = (error: string): middlesoftwareActionTypes => {
  return {
    type: SET_ERROR,
    payload: error
  }
}

export const clearMiddlesoftwareError = (): middlesoftwareActionTypes => {
  return {
    type: CLEAR_ERROR
  }
}