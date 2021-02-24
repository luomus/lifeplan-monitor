import { ActivityType } from '../middlesoftware/types'
export const SET_DATA = 'SET_LIFEPLAN_DATA'
export const CLEAR_DATA = 'CLEAR_LIFEPLAN_DATA'
export const SET_LOADING = 'SET_LIFEPLAN_LOADING'
export const CLEAR_LOADING = 'CLEAR_LIFEPLAN_LOADING'
export const SET_ERROR = 'SET_LIFEPLAN_ERROR'
export const CLEAR_ERROR = 'CLEAR_LIFEPLAN_ERROR'

export interface CountType {
  unporcessed: number,
  inProgress: number,
  completed: number,
  failed: number
}

export interface LifeplanDataType {
  count: CountType,
  activities: ActivityType[]
}

export interface LifeplanReducer {
  error: any,
  data: LifeplanDataType | null,
  loading: boolean
}

interface setData {
  type: typeof SET_DATA,
  payload: LifeplanDataType
}

interface clearData {
  type: typeof CLEAR_DATA
}

interface setLifeplanLoading {
  type: typeof SET_LOADING
}

interface clearLifeplanLoading {
  type: typeof CLEAR_LOADING
}

interface setLifeplanError {
  type: typeof SET_ERROR,
  payload: string
}

interface clearLifeplanError {
  type: typeof CLEAR_ERROR
}

export type lifeplanActionTypes =
  setData |
  clearData |
  setLifeplanLoading |
  clearLifeplanLoading |
  setLifeplanError |
  clearLifeplanError