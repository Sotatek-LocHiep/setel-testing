import { chakra } from '@chakra-ui/react'
import { OrderStateInterface } from 'features/home/order/order-interface'
import React from 'react'
import { MdOutlineCancel } from 'react-icons/md'
import { TiTickOutline } from 'react-icons/ti'
import ConfirmButton from 'shared/components/ConfirmButton'
import { requestCancelOrder, requestConfirmOrder } from '../../MyOrderApi'

const CTiTickOutline = chakra(TiTickOutline)
const CMdOutlineCancel = chakra(MdOutlineCancel)

export type OrderActionItemProps = {
  orderId: number
  cbConfirmOrder: (state: OrderStateInterface) => void
  cbCancelOrder: (state: OrderStateInterface) => void
}

export default function OrderAction({
  orderId,
  cbConfirmOrder,
  cbCancelOrder,
}: OrderActionItemProps) {
  const [isBtnConfirmLoading, setBtnConfirmLoading] = React.useState(false)
  const [isBtnCancelLoading, setBtnCancelLoading] = React.useState(false)

  const onConfirmOrder = async () => {
    try {
      setBtnConfirmLoading(true)
      const { data } = await requestConfirmOrder(orderId)
      if (data) cbConfirmOrder(data)
    } catch (error) {
    } finally {
      setBtnConfirmLoading(false)
    }
  }
  const onCancelOrder = async () => {
    try {
      setBtnCancelLoading(true)
      const { data } = await requestCancelOrder(orderId)
      if (data) cbCancelOrder(data)
    } catch (error) {
    } finally {
      setBtnConfirmLoading(false)
    }
  }

  return (
    <>
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
      />
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
      />
    </>
  )
}
