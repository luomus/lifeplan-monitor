import {
  SET_TOKENS,
  CLEAR_TOKENS,
  tokenActionTypes,
  TokenReducer,
  SET_LOADING,
  CLEAR_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
} from './types'

const initState: TokenReducer = {
  error: null,
  loading: false,
  tokens: []
}
const apiTokenReducer = (state: TokenReducer = initState, action: tokenActionTypes): TokenReducer => {
  switch (action.type) {
    case SET_TOKENS:
      return {
        ...initState,
        tokens: action.payload
      }
    case CLEAR_TOKENS:
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
        ...state,
        error: action.payload
      }
    case CLEAR_ERROR:
      return initState
    default:
      return state
  }
}

export {
  apiTokenReducer
}