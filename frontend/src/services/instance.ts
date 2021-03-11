import axios from 'axios'
import { InstanceType } from '../stores'

export const stopInstanceAndResetActivity = async (id: string): Promise<InstanceType> => {
  const res = await axios.patch(
    `/api/instance/stop/${id}`,
    {
      withCredentials: true,
    }
  )

  return res.data
}