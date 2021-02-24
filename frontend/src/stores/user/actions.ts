import { ThunkAction } from 'redux-thunk'
import { Socket } from 'socket.io-client'
import { login, logout } from '../../services/auth'
import { CLEAR_ERROR, CLEAR_LOADING, CLEAR_USER, SET_ERROR, SET_LOADING, SET_USER, userActionTypes, UserType } from './types'

export const userLogin = (
  username: string,
  password: string,
  createSocket: () => void,
  redirect: () => void,
  initLogoutTimer: (expiresAt: Date) => void
): ThunkAction<void, any, null, userActionTypes> => {

  return async dispatch => {
    dispatch(setUserLoading())
    try {
      const user: UserType = await login(username, password)
      createSocket()
      dispatch(setUser(user))
      initLogoutTimer(user.expiresAt)
      redirect()
    } catch (err) {
      dispatch(setUserError(`${err.response.status}: ${err.response.data.error}`))
    } finally {
      dispatch(clearUserLoading())
    }
  }
}

export const userLogout = (
  socket: Socket,
  redirect?: () => void,
  clearLogoutTimer?: () =>  void
): ThunkAction<void, any, null, userActionTypes> => {
  return async dispatch => {
    dispatch(setUserLoading())
    try {
      dispatch(clearUser())
      await logout()
    } catch (err) {
      dispatch(setUserError(`${err.response.status}: ${err.response.data.error}`))
    } finally {
      socket.disconnect()
      clearLogoutTimer?.()
      redirect?.()
      dispatch(clearUserLoading())
    }
  }
}

const setUser = (userData: UserType): userActionTypes => {
  return {
    type: SET_USER,
    payload: userData
  }
}

export const clearUser = (): userActionTypes => {
  return {
    type: CLEAR_USER
  }
}

export const setUserLoading = (): userActionTypes => {
  return {
    type: SET_LOADING
  }
}

export const clearUserLoading = (): userActionTypes => {
  return {
    type: CLEAR_LOADING
  }
}

export const setUserError = (error: string): userActionTypes => {
  return {
    type: SET_ERROR,
    payload: error
  }
}

export const clearUserError = (): userActionTypes => {
  return {
    type: CLEAR_ERROR
  }
}