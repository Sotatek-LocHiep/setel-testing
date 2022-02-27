import { Box, Flex, Divider } from '@chakra-ui/react'
import Order from './order/Order'
import Product from './product/Product'
export default function Home() {
  return (
    <Flex color="white">
      <Box flex="1">
        <Product />
      </Box>
      <Divider orientation="vertical" borderColor={'gray'} />
      <Box flex="1">
        <Order />
      </Box>
    </Flex>
  )
}
