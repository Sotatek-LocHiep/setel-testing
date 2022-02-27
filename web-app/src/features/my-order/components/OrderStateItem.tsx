import React from 'react'
import { Badge, Text } from '@chakra-ui/react'
import { ORDER_STATUS } from 'features/home/order/constants'

interface OrderStateItemProps {
  state?: ORDER_STATUS
}

export default function OrderStateItem({ state }: OrderStateItemProps) {
  const StateText = React.useMemo(() => {
    switch (state) {
      case ORDER_STATUS.CREATED:
        return <Badge colorScheme="green">Created</Badge>
      case ORDER_STATUS.CONFIRMED:
        return <Badge colorScheme="yellow">Confirmed</Badge>
      case ORDER_STATUS.DELIVERED:
        return <Badge colorScheme="blue">Delivered</Badge>
      case ORDER_STATUS.CANCELLED:
        return <Badge colorScheme="red">Canceled</Badge>
      default:
        return <Text></Text>
    }
  }, [state])
  return StateText
}
