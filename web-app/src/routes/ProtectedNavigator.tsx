import configuration from 'config/configuration'
import Cookies from 'js-cookie'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import Header from 'shared/components/Header'
import DeepRoutes from './DeepRoutes'
import { ProtectedComponents } from './protected-components'
import { paths } from './route-path'
import { getProfileAction } from 'features/auth/AuthSlice'
import { Divider, Box } from '@chakra-ui/react'
import { WebSocketService } from 'shared/services/ws/ws.service'
import { WS_EVENTS } from 'shared/services/ws/ws.event'
import { useToast, Link } from '@chakra-ui/react'
import { OrderStateInterface } from 'features/home/order/order-interface'

const toastDefaultOption: any = {
  duration: 2000,
  isClosable: true,
  position: 'top-right',
}
type DeliveryWS = {
  code: string
} & OrderStateInterface

export default function ProtectedNavigator() {
  const history = useHistory()
  const dispatch = useDispatch()
  const toast = useToast()
  React.useEffect(() => {
    const session = Cookies.get(configuration.AUTHENTICATION_COOKIE_KEY)
    if (isEmpty(session)) history.push(paths.LOGIN)
    else dispatch(getProfileAction())
    WebSocketService.init(session as string)
    WebSocketService.socketClient?.on(
      WS_EVENTS.DELIVERY_ORDER,
      (data: DeliveryWS) =>
        toast({
          ...toastDefaultOption,
          title: 'Order delivery.',
          description: (
            <>
              Your order ${data.code} has been moved to delivery status{'  '}
              <Link href={`/my-order/${data.order_id}`}>
                <u>see your order</u>
              </Link>
            </>
          ),
          status: 'info',
        })
    )
    return () => {
      WebSocketService.socketClient?.disconnect()
    }
  }, [history, dispatch])

  return (
    <Box bg={'#f0f2f5'}>
      <Header />
      <Divider borderColor={'white'} />
      <DeepRoutes components={ProtectedComponents} />
    </Box>
  )
}
