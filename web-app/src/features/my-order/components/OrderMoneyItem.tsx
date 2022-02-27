import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { OrderItemInterface } from 'features/home/order/order-interface'
import { formatMoney } from 'shared/utils/format-money'

interface OrderMoneyItemProps {
  items: OrderItemInterface[]
}
export default function OrderMoneyItem({ items }: OrderMoneyItemProps) {
  const TextPriceOrderItem = React.useMemo(() => {
    const { total_price, total_sale_price } = items.reduce(
      (prev, cur) => ({
        total_price: prev.total_price + cur.amount * cur.price,
        total_sale_price:
          prev.total_sale_price + cur.amount * (cur.sale_price || cur.price),
      }),
      {
        total_price: 0,
        total_sale_price: 0,
      }
    )
    return total_price !== total_sale_price ? (
      <Flex>
        <Text fontSize="sm" as="del" color={'#929292'}>
          {formatMoney(total_price, 'USD')}
        </Text>
        <Text marginLeft={'2'} fontSize="sm" color={'green.500'}>
          {formatMoney(total_sale_price, 'USD')}
        </Text>
      </Flex>
    ) : (
      <Text fontSize="sm" color={'blackAlpha.700'}>
        {formatMoney(total_price, 'USD')}
      </Text>
    )
  }, [items])

  return TextPriceOrderItem
}
