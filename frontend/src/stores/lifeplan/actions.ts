import { ThunkAction } from 'redux-thunk'
import { Socket } from 'socket.io-client'
import { ActivityType } from '..'
import { resetLifeplanActivity } from '../../services/lifeplan'
import {
  CLEAR_ERROR,
  CLEAR_DATA,
  CLEAR_LOADING,
  lifeplanActionTypes,
  SET_ERROR,
  SET_DATA,
  SET_LOADING,
  LifeplanDataType
} from './types'

export const fetchLifeplanData  = (socket: Socket): ThunkAction<void, any, null, lifeplanActionTypes> => {
  return async dispatch => {
    dispatch(setLifeplanLoading())
    try {
      socket.emit('get_lifeplan', (response) => {
        if (response.error) {
          dispatch(setLifeplanError(`500: ${response.error}`))
        } else {
          dispatch(setData(response))
        }
        dispatch(clearLifeplanLoading())
      })
    } catch (err) {
      dispatch(setLifeplanError(`${err}`))
      dispatch(clearLifeplanLoading())
    }
  }
}

export const setData = (data: LifeplanDataType): lifeplanActionTypes => {
  return {
    type: SET_DATA,
    payload: data
  }
}

export const resetAndRemoveLifeplanActivity = (id: number): ThunkAction<Promise<any>, any, null, lifeplanActionTypes> => {
  return async (dispatch, getState) => {
    const { lifeplan } = getState()

    try {
      await resetLifeplanActivity(id)

      const newCount = { ...lifeplan.data.count }
      const newActivities = lifeplan.data.activities.filter((activity: ActivityType) => {
        if (activity.id === id) {
          newCount[activity.status] -= 1
          newCount['activity.lifeplan.status.0'] += 1
        }

        return activity.id !== id
      })

      dispatch(setData({
        count: newCount,
        activities: newActivities
      }))

      return Promise.resolve()
    } catch (err) {
      dispatch(setLifeplanError(`${err.response?.status}: ${err.response?.data?.error}`))
      return Promise.reject()
    }
  }
}

export const clearData = (): lifeplanActionTypes => {
  return {
    type: CLEAR_DATA
  }
}

export const setLifeplanLoading = (): lifeplanActionTypes => {
  return {
    type: SET_LOADING
  }
}

export const clearLifeplanLoading = (): lifeplanActionTypes => {
  return {
    type: CLEAR_LOADING
  }
}

export const setLifeplanError = (error: string): lifeplanActionTypes => {
  return {
    type: SET_ERROR,
    payload: error
  }
}

export const clearLifeplanError = (): lifeplanActionTypes => {
  return {
    type: CLEAR_ERROR
  }
}