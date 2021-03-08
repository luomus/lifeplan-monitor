import axios from 'axios'
import { LifeplanDataType } from '../stores'

export const getLifeplanData = async (): Promise<LifeplanDataType> => {
  const res = await axios.get(
    '/api/lifeplan',
    {
      withCredentials: true,
    }
  )

  return res.data
}

export const resetLifeplanActivity = async (id: number): Promise<number> => {
  const res = await axios.patch(
    `/api/lifeplan/${id}`,
    {
      withCredentials: true,
    }
  )

  return res.data
}