import { Box, Flex, Text } from '@chakra-ui/react'
import { MyOrderInterface } from 'features/my-order/my-order-interface'
import React from 'react'
import { formatDateToCleanString } from 'shared/utils/format-date'
import { formatMoney } from 'shared/utils/format-money'

interface OrderInformationProps {
  order: MyOrderInterface | null
}

export default function OrderInformation({ order }: OrderInformationProps) {
  const { total_price, total_sale_price } = React.useMemo(() => {
    if (order?.order_items) {
      const { total_price, total_sale_price } = order?.order_items.reduce(
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
      return { total_price, total_sale_price }
    }
    return { total_price: 0, total_sale_price: 0 }
  }, [order?.id])

  return (
    <Box padding={5}>
      <Flex padding={2}>
        <Text fontSize="xl" flex={1}>
          Owner:
        </Text>
        <Text fontSize="xl" flex={8}>
          {order?.user.username}
        </Text>
      </Flex>

      <Flex padding={2}>
        <Text fontSize="xl" flex={1}>
          Note:
        </Text>
        <Text fontSize="xl" flex={8}>
          {order?.note || '...'}
        </Text>
      </Flex>

      <Flex padding={2}>
        <Text fontSize="xl" flex={1}>
          Address:
        </Text>
        <Text fontSize="xl" flex={8}>
          {order?.address}
        </Text>
      </Flex>

      <Flex padding={2}>
        <Text fontSize="xl" flex={1}>
          Total:
        </Text>
        {total_price !== total_sale_price ? (
          <Flex flex={8}>
            <Text fontSize="xl" as="del" color={'#929292'}>
              {formatMoney(total_price, 'USD')}
            </Text>
            <Text marginLeft={'2'} fontSize="xl" color={'green.500'}>
              {formatMoney(total_sale_price, 'USD')}
            </Text>
          </Flex>
        ) : (
          <Text fontSize="xl" color={'blackAlpha.700'} flex={8}>
            {formatMoney(total_price, 'USD')}
          </Text>
        )}
      </Flex>

      <Flex padding={2}>
        <Text fontSize="xl" flex={1}>
          Created:
        </Text>
        <Text fontSize="xl" flex={8}>
          {formatDateToCleanString(order?.created_at)}
        </Text>
      </Flex>
    </Box>
  )
}
