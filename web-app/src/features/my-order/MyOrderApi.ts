import { ApiBaseService } from 'shared/services/api/api-base.service'
import { QueryPaginatorInterface } from 'shared/utils/query-paginator-interface'
import { ResponsePaginatorInterface } from 'shared/utils/response-paginator-interface'
import { parseUrl } from 'shared/utils/parse-url'
import { MyOrderInterface } from './my-order-interface'
import { OrderStateInterface } from 'features/home/order/order-interface'

interface GetOrderQueryInterface extends QueryPaginatorInterface {
  search?: string
}
interface SuccessGetOrderResponse {
  data: MyOrderInterface
}
interface SuccessStatusResponse {
  data: OrderStateInterface
}

export const requestGetOrders = (
  query: GetOrderQueryInterface
): Promise<ResponsePaginatorInterface<MyOrderInterface>> =>
  ApiBaseService.get(parseUrl('/api/v1/order', query))

export const requestGetOrder = (
  order_id: number
): Promise<SuccessGetOrderResponse> =>
  ApiBaseService.get(`/api/v1/order/${order_id}`)

export const requestConfirmOrder = (
  order_id: number
): Promise<SuccessStatusResponse> =>
  ApiBaseService.put(`/api/v1/order-state/${order_id}/confirm`)
export const requestCancelOrder = (
  order_id: number
): Promise<SuccessStatusResponse> =>
  ApiBaseService.put(`/api/v1/order-state/${order_id}/cancel`)
