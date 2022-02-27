import { Button, chakra, Flex } from '@chakra-ui/react'
import { ORDER_STATUS } from 'features/home/order/constants'
import { OrderStateInterface } from 'features/home/order/order-interface'
import React from 'react'
import { HiOutlineEye } from 'react-icons/hi'
import { MdOutlineCancel } from 'react-icons/md'
import { TiTickOutline } from 'react-icons/ti'
import { useHistory } from 'react-router-dom'
import { paths } from 'routes/route-path'
import ConfirmButton from 'shared/components/ConfirmButton'
import { requestCancelOrder, requestConfirmOrder } from '../MyOrderApi'

const CHiOutlineEye = chakra(HiOutlineEye)
const CTiTickOutline = chakra(TiTickOutline)
const CMdOutlineCancel = chakra(MdOutlineCancel)

export type OrderActionItemProps = {
  orderId: number
  orderCode: string
  state?: ORDER_STATUS
  cbConfirmOrder: (
    order_id: number,
    order_code: string,
    state: OrderStateInterface
  ) => void
  cbCancelOrder: (
    order_id: number,
    order_code: string,
    state: OrderStateInterface
  ) => void
}

export default function OrderActionItem({
  orderId,
  orderCode,
  state,
  cbConfirmOrder,
  cbCancelOrder,
}: OrderActionItemProps) {
  const history = useHistory()
  const [isBtnConfirmLoading, setBtnConfirmLoading] = React.useState(false)
  const [isBtnCancelLoading, setBtnCancelLoading] = React.useState(false)

  const onConfirmOrder = async () => {
    try {
      setBtnConfirmLoading(true)
      const { data } = await requestConfirmOrder(orderId)
      if (data) cbConfirmOrder(orderId, orderCode, data)
    } catch (error) {
    } finally {
      setBtnConfirmLoading(false)
    }
  }
  const onCancelOrder = async () => {
    try {
      setBtnCancelLoading(true)
      const { data } = await requestCancelOrder(orderId)
      if (data) cbCancelOrder(orderId, orderCode, data)
    } catch (error) {
    } finally {
      setBtnConfirmLoading(false)
    }
  }
  const OrderActionButton = React.useMemo(() => {
    let buttons = [
      <Button
        key={'btn-view'}
        colorScheme={'yellow'}
        variant="outline"
        size="sm"
        rightIcon={<CHiOutlineEye />}
        onClick={() => history.push(`${paths.MY_ORDER}/${orderId}`)}
      >
        view
      </Button>,
    ]
    if (state === ORDER_STATUS.CREATED) {
      buttons = [
        <ConfirmButton
          key={'btn-cancel'}
          textButton="cancel"
          isBtnLoading={isBtnCancelLoading}
          isBtnDisabled={isBtnConfirmLoading}
          colorScheme="red"
          iconButton={<CMdOutlineCancel />}
          textHeaderPopover="Confirmation"
          textBodyPopover="Are you sure to cancel this order?"
          onConfirm={onCancelOrder}
        />,
        <ConfirmButton
          key={'btn-confirm'}
          textButton="confirm"
          isBtnLoading={isBtnConfirmLoading}
          isBtnDisabled={isBtnCancelLoading}
          colorScheme="green"
          iconButton={<CTiTickOutline />}
          textHeaderPopover="Confirmation"
          textBodyPopover="Are you sure to confirm this order?"
          onConfirm={onConfirmOrder}
        />,
        ...buttons,
      ]
    }
    return <Flex>{buttons}</Flex>
  }, [state, isBtnCancelLoading, isBtnConfirmLoading])

  return OrderActionButton
}
