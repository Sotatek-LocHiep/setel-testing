import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Text,
  useToast,
} from '@chakra-ui/react'
import { ORDER_STATUS } from 'features/home/order/constants'
import { OrderStateInterface } from 'features/home/order/order-interface'
import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { WS_EVENTS } from 'shared/services/ws/ws.event'
import { WebSocketService } from 'shared/services/ws/ws.service'
import { MyOrderInterface } from '../my-order-interface'
import { requestGetOrder } from '../MyOrderApi'
import { getLastOrderStateStatus } from '../utils/get-last-order-state-status'
import OrderAction from './components/OrderAction'
import OrderInformation from './components/OrderInformation'
import OrderItemTable from './components/OrderItemTable'
import OrderStateTimeline from './components/OrderStateTimeline'
import { omit } from 'lodash'

const toastDefaultOption: any = {
  duration: 2000,
  isClosable: true,
  position: 'top-right',
}
type DeliveryWS = {
  code: string
} & OrderStateInterface

export default function MyOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const toast = useToast()
  const [order, setOrder] = React.useState<MyOrderInterface | null>(null)
  React.useEffect(() => {
    if (id) {
      getOrder(Number(id))
    }
  }, [id])
  React.useEffect(() => {
    if (WebSocketService.socketClient) {
      WebSocketService.socketClient?.on(
        WS_EVENTS.DELIVERY_ORDER,
        (data: DeliveryWS) => {
          setOrder((prevOrder: MyOrderInterface | null) => {
            if (prevOrder?.id === data.order_id) {
              prevOrder.order_states.push(omit(data, ['code']))
              return { ...prevOrder }
            }
            return prevOrder
          })
        }
      )
    }
  }, [WebSocketService.socketClient])

  const getOrder = async (id: number) => {
    try {
      const { data } = await requestGetOrder(id)
      setOrder(data)
    } catch (error) {
    } finally {
    }
  }

  const cbConfirmOrder = (state: OrderStateInterface) => {
    if (order?.order_states && state) {
      order.order_states.push(state)
      setOrder({ ...order })
      return toast({
        ...toastDefaultOption,
        title: 'Confirm order success.',
        description: `Your order ${order.code} confirmed success.`,
        status: 'success',
      })
    }
  }

  const cbCancelOrder = (state: OrderStateInterface) => {
    if (order?.order_states && state) {
      order.order_states.push(state)
      setOrder({ ...order })
      return toast({
        ...toastDefaultOption,
        title: 'Cancel order success.',
        description: `Your order ${order.code} is canceled success.`,
        status: 'success',
      })
    }
  }

  return (
    <>
      <Center padding={2}>
        <Flex
          w={'97%'}
          height={'14'}
          paddingTop={3}
          paddingBottom={3}
          bg={'white'}
        >
          <Button variant="link" onClick={() => history.goBack()}>
            <ArrowBackIcon h={5} boxSize={8} />
          </Button>
          <Text fontSize="2xl" marginLeft={'3'}>
            Order <strong>{order?.code}</strong>
          </Text>
          {order?.order_states &&
            getLastOrderStateStatus(order.order_states) ===
              ORDER_STATUS.CREATED && (
              <Box flex={1}>
                <Flex>
                  <Box flex={1} />
                  <OrderAction
                    orderId={order.id}
                    cbConfirmOrder={cbConfirmOrder}
                    cbCancelOrder={cbCancelOrder}
                  />
                </Flex>
              </Box>
            )}
        </Flex>
      </Center>
      <Center>
        <Grid
          w={'96%'}
          h="400px"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
        >
          <GridItem colSpan={3} bg="white">
            <OrderInformation order={order} />
          </GridItem>
          <GridItem colSpan={2} bg="white">
            <OrderStateTimeline states={order?.order_states} />
          </GridItem>
          <GridItem colSpan={5} bg="white">
            <OrderItemTable items={order?.order_items} />
          </GridItem>
        </Grid>
      </Center>
    </>
  )
}
