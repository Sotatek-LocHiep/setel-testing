import {
  ButtonProps,
  Center,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
  Flex,
} from '@chakra-ui/react'
import {
  Container,
  Next,
  PageGroup,
  Paginator,
  Previous,
  usePaginator,
} from 'chakra-paginator'
import { ORDER_STATUS } from 'features/home/order/constants'
import { OrderStateInterface } from 'features/home/order/order-interface'
import React from 'react'
import Spinner from 'shared/components/Spinner'
import { useSpinner } from 'shared/components/Spinner/hooks/useSpinner'
import { formatDateToCleanString } from 'shared/utils/format-date'
import OrderActionItem from './components/OrderActionItem'
import OrderMoneyItem from './components/OrderMoneyItem'
import OrderStateItem from './components/OrderStateItem'
import { MyOrderInterface } from './my-order-interface'
import { requestGetOrders } from './MyOrderApi'
import { getLastOrderStateStatus } from './utils/get-last-order-state-status'
import { getTotalAmountOrderItems } from './utils/get-total-amount-order-item'
// styles
const baseStyles: ButtonProps = {
  w: 7,
  fontSize: 'sm',
}

const normalStyles: ButtonProps = {
  ...baseStyles,
  _hover: {
    bg: 'green.300',
  },
  bg: 'white',
  color: 'black',
}

const activeStyles: ButtonProps = {
  ...baseStyles,
  _hover: {
    bg: 'blue.300',
  },
  bg: 'green.300',
}

const separatorStyles: ButtonProps = {
  w: 7,
  bg: 'green.200',
}
// constants
const outerLimit = 2
const innerLimit = 2
const toastDefaultOption: any = {
  duration: 2000,
  isClosable: true,
  position: 'top-right',
}

export default function MyOrder() {
  const toast = useToast()
  const [orders, setOrders] = React.useState<MyOrderInterface[]>([])
  const [ordersTotal, setOrdersTotal] = React.useState<number | undefined>(
    undefined
  )
  const { isSpin, activeSpinner, inactiveSpinner } = useSpinner()
  const {
    isDisabled,
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    offset,
  } = usePaginator({
    total: ordersTotal,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  })

  React.useEffect(() => {
    getOrders(currentPage)
  }, [currentPage, pageSize, offset])

  const getOrders = async (page: number) => {
    activeSpinner()
    try {
      const {
        data,
        meta: { pagination },
      } = await requestGetOrders({ page })
      setOrders(data)
      setOrdersTotal(pagination.total)
    } catch (error) {
    } finally {
      inactiveSpinner()
    }
  }

  const cbConfirmOrder = (
    order_id: number,
    orderCode: string,
    state: OrderStateInterface
  ) => {
    if (state) {
      const order = orders.find(order => order.id === order_id)
      if (order) {
        order.order_states.push(state)
        setOrders([...orders])
        if (state.status === ORDER_STATUS.CANCELLED) {
          return toast({
            ...toastDefaultOption,
            title: 'Confirm order error.',
            description: `Your order ${orderCode} canceled because: ${state.reject_reason}`,
            status: 'error',
          })
        } else {
          return toast({
            ...toastDefaultOption,
            title: 'Confirm order success.',
            description: `Your order ${orderCode} confirmed success and has been transferred to the delivery state`,
            status: 'success',
          })
        }
      }
    }
  }

  const cbCancelOrder = (
    order_id: number,
    orderCode: string,
    state: OrderStateInterface
  ) => {
    if (state) {
      const order = orders.find(order => order.id === order_id)
      if (order) {
        order.order_states.push(state)
        setOrders([...orders])
        return toast({
          ...toastDefaultOption,
          title: 'Cancel order success.',
          description: `Your order ${orderCode} is canceled success`,
          status: 'success',
        })
      }
    }
  }
  return (
    <>
      <Center padding={2}>
        <Flex
          w={'98%'}
          height={'14'}
          paddingTop={3}
          paddingBottom={3}
          bg={'white'}
        >
          <Text fontSize="2xl" marginLeft={'3'}>
            <strong>My Orders</strong>
          </Text>
        </Flex>
      </Center>
      <Center>
        <Table variant="simple" bg={'white'} w={'97%'}>
          <TableCaption>
            <Paginator
              isDisabled={isDisabled}
              activeStyles={activeStyles}
              innerLimit={innerLimit}
              currentPage={currentPage}
              outerLimit={outerLimit}
              normalStyles={normalStyles}
              separatorStyles={separatorStyles}
              pagesQuantity={pagesQuantity}
              onPageChange={setCurrentPage}
            >
              <Container align="center" justify="space-between" w="full" p={4}>
                <Previous>
                  <Text color={'blackAlpha.800'}>Previous</Text>
                </Previous>
                <PageGroup isInline align="center" />
                <Next>
                  <Text color={'blackAlpha.800'}>Next</Text>
                </Next>
              </Container>
            </Paginator>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Code</Th>
              <Th>Total items</Th>
              <Th>Total money</Th>
              <Th>Create at</Th>
              <Th>State</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isSpin ? (
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td>
                  <Spinner />
                </Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            ) : (
              orders.map(order => (
                <Tr key={order.id}>
                  <Td>
                    <strong>{order.code}</strong>
                  </Td>
                  <Td>{getTotalAmountOrderItems(order.order_items)}</Td>
                  <Td>
                    <OrderMoneyItem items={order.order_items} />
                  </Td>
                  <Td>{formatDateToCleanString(order.created_at)}</Td>
                  <Td>
                    <OrderStateItem
                      state={getLastOrderStateStatus(order.order_states)}
                    />
                  </Td>
                  <Td>
                    <OrderActionItem
                      orderId={order.id}
                      orderCode={order.code}
                      state={getLastOrderStateStatus(order.order_states)}
                      cbCancelOrder={cbCancelOrder}
                      cbConfirmOrder={cbConfirmOrder}
                    />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      </Center>
    </>
  )
}
