import { ApiBaseService } from 'shared/services/api/api-base.service'

type PayloadLogin = {
  username: string
  password: string
}

type PayloadRegister = {
  username: string
  password: string
}
type ResponseAuth = {
  data: {
    token: string
  }
}
export type ProfileType = {
  id: number
  username: string
  created_at: Date
  updated_at: Date
}
export type ProfileResponse = {
  data: ProfileType
}

export const requestLogin = (payload: PayloadLogin): Promise<ResponseAuth> =>
  ApiBaseService.post('/api/v1/auth/login', payload)
export const requestRegister = (
  payload: PayloadRegister
): Promise<ResponseAuth> =>
  ApiBaseService.post('/api/v1/auth/register', payload)
export const requestGetProfile = (): Promise<ProfileResponse> =>
  ApiBaseService.get('/api/v1/profile')
