import {
  Center,
  Divider,
  Heading,
  List,
  Text,
  Box,
  Image,
  Flex,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { ProductStockInterface } from '../OrderSlice'
import SubmitFormOrder from './components/SubmitFormOrder'
import OrderItem from './components/OrderItem'
import React from 'react'
import R from 'shared/assets'

export default function Order() {
  const productsStock: ProductStockInterface[] = useSelector(
    (state: any) => state.orderReducer.products
  )
  const totalPrice = React.useMemo(
    () =>
      productsStock.reduce(
        (prev: number, cur: ProductStockInterface) =>
          prev + cur.amount * (cur.product.sale_price || cur.product.price),
        0
      ),
    [productsStock]
  )
  return (
    <Box border={'solid 2px'} borderColor={'gainsboro'}>
      <Heading
        as="h4"
        size="md"
        w={'96%'}
        marginLeft={'2%'}
        marginBottom={2}
        color={'blackAlpha.800'}
        textAlign={'center'}
        bg={'white'}
        padding={2}
      >
        <Flex>
          <Image boxSize="30" objectFit="cover" src={R.images.ic_cart} />
          <Text paddingTop={1} marginLeft={3}>
            Order Cart
          </Text>
        </Flex>
      </Heading>
      <Divider />
      <List overflow={'auto'} spacing={1} height={'426'}>
        {productsStock.length > 0 ? (
          productsStock?.map((item: ProductStockInterface) => (
            <OrderItem key={item.product.id} item={item} />
          ))
        ) : (
          <Center marginTop={'20'}>
            <Text color={'blackAlpha.600'} fontSize={'large'}>
              No product in cart
            </Text>
          </Center>
        )}
      </List>
      <Divider />
      <SubmitFormOrder totalPrice={totalPrice} />
    </Box>
  )
}
