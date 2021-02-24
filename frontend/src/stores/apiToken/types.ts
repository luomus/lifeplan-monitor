export const SET_TOKENS = 'SET_TOKENS'
export const CLEAR_TOKENS = 'CLEAR_TOKENS'
export const SET_LOADING = 'SET_TOKEN_LOADING'
export const CLEAR_LOADING = 'CLEAR_TOKEN_LOADING'
export const SET_ERROR = 'SET_TOKEN_ERROR'
export const CLEAR_ERROR = 'CLEAR_TOKEN_ERROR'

export interface TokenType {
  id: number,
  tokenname: string
}

export interface TokenReducer {
  error: any,
  loading: boolean,
  tokens: TokenType[]
}

interface setTokens {
  type: typeof SET_TOKENS,
  payload: TokenType[]
}

interface clearTokens {
  type: typeof CLEAR_TOKENS
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

export type tokenActionTypes =
  setTokens |
  clearTokens |
  setLoading |
  clearLoading |
  setError |
  clearError