import { ThunkAction } from 'redux-thunk'
import { getLifeplanData } from '../../services/lifeplan'
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

export const fetchLifeplanData  = (): ThunkAction<void, any, null, lifeplanActionTypes> => {
  return async dispatch => {
    dispatch(setLifeplanLoading())
    try {
      const data: LifeplanDataType = await getLifeplanData()
      dispatch(setData(data))
    } catch (err) {
      dispatch(setLifeplanError(`${err.response.status}: ${err.response.data.error}`))
    } finally {
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

// export const resetLifeplanActivity = (id: number): ThunkAction<void, any, null, lifeplanActionTypes> => {
//   return (dispatch, getState) => {
//     const { lifeplan } = getState()

//     const newActivities = lifeplan.activities.filter((activity: LifeplanActivityType) => {
//       return activity.id !== id
//     })

//     dispatch(setActivities(newActivities))
//   }
// }

export const clearData = (): lifeplanActionTypes => {
  return {
    type: CLEAR_DATA
  }
}

const setLifeplanLoading = (): lifeplanActionTypes => {
  return {
    type: SET_LOADING
  }
}

const clearLifeplanLoading = (): lifeplanActionTypes => {
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