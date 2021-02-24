import axios from 'axios'
import { UserType } from '../stores'

const headers = {
  'Content-Type': 'application/json'
}

export const login = async (username: string, password: string): Promise<UserType> => {
  const payload = {
    username,
    password
  }

  const res = await axios.post(
    '/api/login',
    payload,
    {
      headers
    }
  )

  return res.data
}

export const logout = async (): Promise<void> => {
  await axios.get(
    '/api/logout',
    {
      withCredentials: true
    }
  )
}
