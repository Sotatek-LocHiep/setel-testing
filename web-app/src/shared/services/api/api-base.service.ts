import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import Cookie from 'js-cookie'
import configuration from 'config/configuration'
import { API_STATUS } from 'config/api-status'
import { alertError, alertInfo } from '../alerts/alert.service'

const createApiInstance = (): AxiosInstance => {
  const apiInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: configuration.EXPIRE_REQUEST,
    responseType: 'json',
  })
  apiInstance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      config.headers.Authorization = `Bearer ${Cookie.get(
        configuration.AUTHENTICATION_COOKIE_KEY
      )}`
      return config
    },
    error => Promise.reject(error)
  )
  apiInstance.interceptors.response.use(
    async (response: AxiosResponse) => {
      return response.data
    },
    error => {
      const data = error?.response?.data
      if (data && data.code === API_STATUS.UNAUTHORIZED) {
        Cookie.set(configuration.AUTHENTICATION_COOKIE_KEY, '')

        alertInfo({
          title: 'Request failure',
          text: data.message,
        })
      } else {
        alertError({
          title: 'Request failure',
          text: data.message || 'Error Network.',
        })
      }
      return error
    }
  )
  return apiInstance
}
export const ApiBaseService: AxiosInstance = createApiInstance()
