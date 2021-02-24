export const SET_INSTANCES = 'SET_INSTANCES'
export const ADD_INSTANCE = 'ADD_INSTANCE'
export const CLEAR_INSTANCES = 'CLEAR_INSTANCES'
export const SET_LOADING = 'SET_MIDDLESOFTWARE_LOADING'
export const CLEAR_LOADING = 'CLEAR_MIDDLESOFTWARE_LOADING'
export const SET_ERROR = 'SET_MIDDLESOFTWARE_ERROR'
export const CLEAR_ERROR = 'CLEAR_MIDDLESOFTWARE_ERROR'

export interface ActivityType {
  id: number,
  uuid: string,
  status: string,
  progress: number,
  notes?: string,
  processedBy?: string,
  createdAt: string,
  updatedAt: string
}

export interface InstanceType {
  id: string,
  status: string,
  notes: string,
  createdAt: string,
  updatedAt: string,
  activities: ActivityType[]
}

export interface ExtendedActivityType extends ActivityType {
  instances: InstanceType[]
}

export interface MiddlesoftwareReducer {
  error: any,
  instances: InstanceType[],
  loading: boolean
}

interface setInstances {
  type: typeof SET_INSTANCES,
  payload: InstanceType[]
}

interface addInstance {
  type: typeof ADD_INSTANCE,
  payload: InstanceType
}

interface clearInstances {
  type: typeof CLEAR_INSTANCES
}

interface setMiddlesoftwareLoading {
  type: typeof SET_LOADING
}

interface clearMiddlesoftwareLoading {
  type: typeof CLEAR_LOADING
}

interface setMiddlesoftwareError {
  type: typeof SET_ERROR,
  payload: string
}

interface clearMiddlesoftwareError {
  type: typeof CLEAR_ERROR
}

export type middlesoftwareActionTypes =
  setInstances |
  addInstance |
  clearInstances |
  setMiddlesoftwareLoading |
  clearMiddlesoftwareLoading |
  setMiddlesoftwareError |
  clearMiddlesoftwareError