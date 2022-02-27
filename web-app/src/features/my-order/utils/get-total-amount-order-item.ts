import { OrderItemInterface } from 'features/home/order/order-interface'

export function getTotalAmountOrderItems(
  order_items: OrderItemInterface[]
): number {
  return order_items.reduce(
    (prev: number, cur: OrderItemInterface) => prev + cur.amount,
    0
  )
}
