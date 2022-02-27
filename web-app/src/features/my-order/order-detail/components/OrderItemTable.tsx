import {
  Flex,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { OrderItemInterface } from 'features/home/order/order-interface'
import { formatMoney } from 'shared/utils/format-money'
interface OrderItemTableProps {
  items?: OrderItemInterface[]
}

export default function MyOrder({ items }: OrderItemTableProps) {
  return (
    <Table variant="simple" bg={'white'}>
      <TableCaption></TableCaption>
      <Thead>
        <Tr>
          <Th>Code</Th>
          <Th>Name</Th>
          <Th>Amount</Th>
          <Th>Price</Th>
        </Tr>
      </Thead>
      <Tbody>
        {items?.map(item => (
          <Tr key={item.id}>
            <Td>
              <strong>{item.product.code}</strong>
            </Td>
            <Td>{item.product.name}</Td>
            <Td>{item.amount}</Td>
            <Td>
              {item.sale_price ? (
                <Flex flex={8}>
                  <Text fontSize="xl" as="del" color={'#929292'}>
                    {formatMoney(item.price, 'USD')}
                  </Text>
                  <Text marginLeft={'2'} fontSize="xl" color={'green.500'}>
                    {formatMoney(item.sale_price, 'USD')}
                  </Text>
                </Flex>
              ) : (
                <Text fontSize="xl" color={'blackAlpha.700'} flex={8}>
                  {formatMoney(item.price, 'USD')}
                </Text>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
      <Tfoot></Tfoot>
    </Table>
  )
}
