export const SET_USER = 'SET_USER'
export const CLEAR_USER = 'CLEAR_USER'
export const SET_LOADING = 'SET_LOADING'
export const CLEAR_LOADING = 'CLEAR_LOADING'
export const SET_ERROR = 'SET_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'

export interface UserType {
  id: number,
  username: string,
  expiresAt: Date
}

export interface UserReducer {
  error: any,
  loading: boolean,
  expiresAt?: Date,
  userData: UserType | null
}

interface setUser {
  type: typeof SET_USER,
  payload: UserType
}

interface clearUser {
  type: typeof CLEAR_USER
}

interface setLoading {
  type: typeof SET_LOADING
}

interface clearLoading {
  type: typeof CLEAR_LOADING
}

interface setError {
  type: typeof SET_ERROR,
  payload: string
}

interface clearError {
  type: typeof CLEAR_ERROR
}

export type userActionTypes =
  setUser |
  clearUser |
  setLoading |
  clearLoading |
  setError |
  clearError