import {
  SET_USER,
  CLEAR_USER,
  userActionTypes,
  UserReducer,
  SET_LOADING,
  CLEAR_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
} from './types'

const initState: UserReducer = {
  error: null,
  loading: false,
  userData: null
}
const userReducer = (state: UserReducer = initState, action: userActionTypes): UserReducer => {
  switch (action.type) {
    case SET_USER:
      return {
        ...initState,
        expiresAt: action.payload.expiresAt,
        userData: action.payload
      }
    case CLEAR_USER:
      return {
        ...initState,
        error: state.error
      }
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
        ...state,
        error: action.payload
      }
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

export {
  userReducer
}