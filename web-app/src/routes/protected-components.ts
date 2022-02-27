import Home from 'features/home/Home'
import MyOrder from 'features/my-order/MyOrder'
import MyOrderDetail from 'features/my-order/order-detail/MyOrderDetail'
import { paths } from './route-path'
import { DeepRoutesComponentsType } from './type'

export const ProtectedComponents: Array<DeepRoutesComponentsType> = [
  {
    isProtect: true,
    path: paths.HOME,
    component: Home,
    exact: true,
  },
  {
    isProtect: true,
    path: paths.MY_ORDER,
    component: MyOrder,
    exact: true,
  },
  {
    isProtect: true,
    path: paths.MY_ORDER_DETAIL,
    component: MyOrderDetail,
    exact: true,
  },
]
