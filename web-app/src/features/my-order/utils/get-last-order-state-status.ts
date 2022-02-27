import { OrderStateInterface } from 'features/home/order/order-interface'
export function getLastOrderStateStatus(
  states: OrderStateInterface[]
): number | undefined {
  const lastState = states.reduce(
    (prev, current) => (prev.id > current.id ? prev : current),
    states[0]
  )
  return lastState.status
}
