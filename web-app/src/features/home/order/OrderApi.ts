import { ApiBaseService } from 'shared/services/api/api-base.service'
import { CreateOrderPayload, CreateOrderResponse } from './order-interface'

export const requestCreateOrder = (
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> => ApiBaseService.post('/api/v1/order', payload)
