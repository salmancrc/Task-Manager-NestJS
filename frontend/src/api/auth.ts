import apiClient from './axios'

export interface SignupDto {
  email: string
  password: string
  name?: string
}

export interface SigninDto {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}

export interface SignupResponse {
  id: number
  email: string
  name?: string
}

export const signup = async (data: SignupDto): Promise<SignupResponse> => {
  const res = await apiClient.post<SignupResponse>('/auth/signup', data)
  return res.data
}

export const signin = async (data: SigninDto): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/auth/signin', data)
  return res.data
}
