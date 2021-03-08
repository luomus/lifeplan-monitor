import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import { userReducer } from './user/reducers'
import {
  userLogin,
  userLogout,
  clearUserError,
  setUserError
} from './user/actions'
import {
  UserReducer,
  UserType
} from './user/types'
import thunk from 'redux-thunk'
import {
  middlesoftwareReducer
} from './middlesoftware/reducers'
import {
  addInstance,
  deleteInstance,
  setInstances,
  updateInstance,
  clearInstances,
  setMiddlesoftwareError,
  clearMiddlesoftwareError,
  updateInstanceAndActivity
} from './middlesoftware/actions'
import {
  MiddlesoftwareReducer,
  InstanceType,
  ActivityType
} from './middlesoftware/types'
import {
  persistStore,
  persistReducer
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createExpirationTransform from 'redux-persist-transform-expire'
import {
  apiTokenReducer
} from './apiToken/reducers'
import {
  clearTokenError,
  createToken,
  fetchTokens,
  removeToken
} from './apiToken/actions'
import {
  TokenReducer,
  TokenType
} from './apiToken/types'
import {
  lifeplanReducer
} from './lifeplan/reducers'
import {
  clearLifeplanError,
  fetchLifeplanData
} from './lifeplan/actions'
import {
  CountType,
  LifeplanDataType,
  LifeplanReducer
} from './lifeplan/types'
import { resetActivity } from './shared/actions'

export interface RootState {
  apiToken: TokenReducer,
  lifeplan: LifeplanReducer,
  middlesoftware: MiddlesoftwareReducer,
  user: UserReducer
}

const expireTransform = createExpirationTransform({
  expireKey: 'expiresAt',
  defaultState: {
    error: null,
    loading: false,
    userData: null
  },
})

const rootReducer = persistReducer({
  key: 'userReducer',
  storage: storage,
  transforms: [expireTransform],
  whitelist: ['user']
}, combineReducers({
  middlesoftware: middlesoftwareReducer,
  user: userReducer,
  apiToken: apiTokenReducer,
  lifeplan: lifeplanReducer

}))

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

const persistor = persistStore(store)

export {
  store,
  persistor
}

export {
  userLogin,
  userLogout,
  setUserError,
  clearUserError,
  setInstances,
  addInstance,
  updateInstance,
  deleteInstance,
  clearInstances,
  updateInstanceAndActivity,
  setMiddlesoftwareError,
  clearMiddlesoftwareError,
  fetchTokens,
  createToken,
  removeToken,
  clearTokenError,
  fetchLifeplanData,
  clearLifeplanError,
  resetActivity
}

export type {
  TokenReducer,
  MiddlesoftwareReducer,
  UserReducer,
  UserType,
  InstanceType,
  TokenType,
  LifeplanDataType,
  CountType,
  ActivityType
}