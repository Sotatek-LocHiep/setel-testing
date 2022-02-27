import { ProfileType } from 'features/auth/AuthApi'
import {
  OrderItemInterface,
  OrderStateInterface,
} from 'features/home/order/order-interface'

export interface MyOrderInterface {
  id: number
  note: string
  address: string
  code: string
  created_at: Date
  order_items: OrderItemInterface[]
  order_states: OrderStateInterface[]
  user: ProfileType
}
