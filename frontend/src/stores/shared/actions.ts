import { ThunkAction } from 'redux-thunk'
import { setLifeplanLoading, resetAndRemoveLifeplanActivity, clearLifeplanLoading } from '../lifeplan/actions'
import { lifeplanActionTypes } from '../lifeplan/types'
import { clearMiddlesoftwareLoading, deleteActivity, setMiddlesoftwareLoading } from '../middlesoftware/actions'
import { middlesoftwareActionTypes } from '../middlesoftware/types'

export const resetActivity = (id: number): ThunkAction<void, any, null, middlesoftwareActionTypes | lifeplanActionTypes> => {
  return async (dispatch) => {
    dispatch(setMiddlesoftwareLoading())
    dispatch(setLifeplanLoading())

    try {
      await dispatch(resetAndRemoveLifeplanActivity(id))
      await dispatch(deleteActivity(id))

    } finally {
      dispatch(clearMiddlesoftwareLoading())
      dispatch(clearLifeplanLoading())
    }
  }
}