import {
  CLEAR_INSTANCES,
  SET_INSTANCES,
  middlesoftwareActionTypes,
  MiddlesoftwareReducer,
  SET_LOADING,
  CLEAR_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  ADD_INSTANCE
} from './types'

const initState: MiddlesoftwareReducer = {
  error: null,
  instances: [],
  loading: false
}

const middlesoftwareReducer = (state: MiddlesoftwareReducer = initState, action: middlesoftwareActionTypes): MiddlesoftwareReducer => {
  switch (action.type) {
    case SET_INSTANCES:
      return {
        ...state,
        instances: action.payload
      }
    case ADD_INSTANCE:
      return {
        ...state,
        instances: state.instances.concat(action.payload)
      }
    case CLEAR_INSTANCES:
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
  middlesoftwareReducer
}