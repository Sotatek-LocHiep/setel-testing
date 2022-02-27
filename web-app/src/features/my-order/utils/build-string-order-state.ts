import { ORDER_STATUS } from 'features/home/order/constants'

export function buildStringStateOrder(state?: ORDER_STATUS) {
  switch (state) {
    case ORDER_STATUS.CREATED:
      return 'Created'
    case ORDER_STATUS.CONFIRMED:
      return 'Confirmed'
    case ORDER_STATUS.DELIVERED:
      return 'Delivered'
    case ORDER_STATUS.CANCELLED:
      return 'Canceled'
    default:
      return ''
  }
}
