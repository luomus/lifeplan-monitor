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
  ExtendedActivityType,
  SET_LOADING,
  CLEAR_LOADING
} from './types'
import { stopInstanceAndResetActivity } from '../../services/instance'

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

export const stopInstance = (id: string): ThunkAction<void, any, null, middlesoftwareActionTypes> => {
  return async (dispatch) => {
    dispatch(setMiddlesoftwareLoading())

    try {
      await stopInstanceAndResetActivity(id)
    } catch (err) {
      dispatch(setMiddlesoftwareError(`${err.response.status}: ${err.response.data.error}`))
    } finally {
      dispatch(clearMiddlesoftwareLoading())
    }
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

export const deleteActivity = (id: number): ThunkAction<Promise<void>, any, null, middlesoftwareActionTypes> => {
  return (dispatch, getState) => {
    const { middlesoftware } = getState()

    const newInstances = middlesoftware.instances.map((oldInstance: InstanceType) => {
      const oldActivities = oldInstance.activities
      const newActivities = oldActivities.filter((oldActivity: ActivityType) => {
        return oldActivity.id !== id
      })

      return {
        ...oldInstance,
        activities: newActivities
      }
    })

    dispatch(setInstances(newInstances))
    return Promise.resolve()
  }
}

export const clearInstances = (): middlesoftwareActionTypes => {
  return {
    type: CLEAR_INSTANCES
  }
}

export const setMiddlesoftwareLoading = (): middlesoftwareActionTypes => {
  return {
    type: SET_LOADING
  }
}

export const clearMiddlesoftwareLoading = (): middlesoftwareActionTypes => {
  return {
    type: CLEAR_LOADING
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