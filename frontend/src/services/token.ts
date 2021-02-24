import axios from 'axios'
import { TokenType } from '../stores'

const headers = {
  'Content-Type': 'application/json'
}

export const getTokens = async (): Promise<TokenType[]> => {
  const res = await axios.get(
    '/api/token',
    {
      headers,
      withCredentials: true
    }
  )

  return res.data
}

export const postToken = async (token: string): Promise<TokenType & { token: string }> => {
  const res = await axios.post(
    '/api/token',
    {
      tokenname: token
    },
    {
      withCredentials: true
    }
  )

  return res.data
}

export const deleteToken = async (id: number): Promise<void> => {
  await axios.delete(
    `api/token/${id}`,
    {
      params: { id: id },
      withCredentials: true
    }
  )
}