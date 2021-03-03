import {
  SET_LOADING,
  CLEAR_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  SET_DATA,
  LifeplanReducer,
  lifeplanActionTypes,
  CLEAR_DATA,
  CountType,
} from './types'

const initCount: CountType = {
  'activity.lifeplan.status.0': 0,
  'activity.lifeplan.status.1': 0,
  'activity.lifeplan.status.2': 0,
  'activity.lifeplan.status.3': 0
}

const initState: LifeplanReducer = {
  error: null,
  data: {
    count: initCount,
    activities: []
  },
  loading: false
}

const lifeplanReducer = (state: LifeplanReducer = initState, action: lifeplanActionTypes): LifeplanReducer => {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        data: action.payload
      }
    case CLEAR_DATA:
      return initState
    case SET_LOADING:
      return {
        ...state,
        loading: true
      }
    case CLEAR_LOADING:
      return {
        ...state,
        loading: false
      }
    case SET_ERROR:
      return {
        ...initState,
        error: action.payload
      }
    case CLEAR_ERROR:
      return initState
    default:
      return state
  }
}

export {
  lifeplanReducer
}