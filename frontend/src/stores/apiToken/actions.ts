import { ThunkAction } from 'redux-thunk'
import { getTokens, postToken, deleteToken } from '../../services/token'
import { CLEAR_ERROR, CLEAR_LOADING, CLEAR_TOKENS, SET_ERROR, SET_LOADING, SET_TOKENS, tokenActionTypes, TokenType } from './types'

export const fetchTokens = (): ThunkAction<void, any, null, tokenActionTypes> => {
  return async dispatch => {
    dispatch(setTokenLoading())
    try {
      const tokens: TokenType[] = await getTokens()
      dispatch(setTokens(tokens))
    } catch (err) {
      dispatch(setTokenError(`${err.response.status}: ${err.response.data.error}`))
    } finally {
      dispatch(clearTokenLoading())
    }
  }
}

export const createToken = (tokenName: string): ThunkAction<Promise<any>, any, null, tokenActionTypes> => {
  return async (dispatch, getState) => {
    const { apiToken } = getState()

    dispatch(setTokenLoading())
    try {
      const newToken = await postToken(tokenName)
      const { token, ...rest } = newToken
      const newTokens = apiToken.tokens.concat(rest)

      dispatch(setTokens(newTokens))

      return Promise.resolve(token)
    } catch (err) {
      dispatch(setTokenError(`${err.response.status}: ${err.response.data.error}`))
      dispatch(clearTokenLoading())

      return Promise.resolve()
    }
  }
}

export const removeToken = (id: number): ThunkAction<void, any, null, tokenActionTypes> => {
  return async (dispatch, getState) => {
    const { apiToken } = getState()

    dispatch(setTokenLoading())
    try {
      await deleteToken(id)

      const newTokens = apiToken.tokens.filter((token: TokenType) => {
        return token.id !== id
      })

      dispatch(setTokens(newTokens))
    } catch (err) {
      dispatch(setTokenError(`${err.response.status}: ${err.response.data.error}`))
    } finally {
      dispatch(clearTokenLoading())
    }
  }
}

const setTokens = (tokens: TokenType[]): tokenActionTypes => {
  return {
    type: SET_TOKENS,
    payload: tokens
  }
}

export const clearTokens = (): tokenActionTypes => {
  return {
    type: CLEAR_TOKENS
  }
}

export const setTokenLoading = (): tokenActionTypes => {
  return {
    type: SET_LOADING
  }
}

export const clearTokenLoading = (): tokenActionTypes => {
  return {
    type: CLEAR_LOADING
  }
}

export const setTokenError = (error: string): tokenActionTypes => {
  return {
    type: SET_ERROR,
    payload: error
  }
}

export const clearTokenError = (): tokenActionTypes => {
  return {
    type: CLEAR_ERROR
  }
}