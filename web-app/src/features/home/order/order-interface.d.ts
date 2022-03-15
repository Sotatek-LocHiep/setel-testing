import { ProfileType } from 'features/auth/AuthApi'
import { ProductInterface } from '../product/product-interface'
import { ORDER_STATUS } from './constants'

export interface ProductCreateOrderInterface {
  product_id: number
  amount: number
}

export interface CreateOrderPayload {
  note?: string
  address: string
  products: ProductCreateOrderInterface[]
}

export interface OrderItemInterface {
  id: number
  amount: number
  price: number
  sale_price: number
  product: ProductInterface
}

export interface OrderStateInterface {
  id: number
  order_id: number
  status: ORDER_STATUS
  reject_reason?: string | null
  created_at: Date
}

export interface CreateOrderResponse {
  data: {
    id: number
    note: string
    address: string
    code: string
    created_at: Date
    order_items: OrderItemInterface[]
    order_states: OrderStateInterface[]
    user: ProfileType
  }
}
