import {
  Box,
  Flex,
  ListItem,
  Text,
  Button,
  Center,
  useToast,
} from '@chakra-ui/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { CloseIcon } from '@chakra-ui/icons'
import { formatMoney } from 'shared/utils/format-money'
import { ProductStockInterface, removeProductAction } from '../../OrderSlice'

const toastDefaultOption: any = {
  duration: 2000,
  isClosable: true,
  position: 'top-right',
}

type OrderItemProps = {
  item: ProductStockInterface
}

export default function OrderItem({ item }: OrderItemProps) {
  const dispatch = useDispatch()
  const toast = useToast()

  const removeProductToStock = () => {
    dispatch(removeProductAction({ id: item?.product?.id }))
    toast({
      ...toastDefaultOption,
      title: 'Removed product from stock.',
      description: `Removed ${item.amount} ${item.product.name} from stock`,
      status: 'success',
    })
  }

  return (
    <ListItem bg={'white'} borderRadius={'md'} marginLeft={'2%'} width={'96%'}>
      <div style={{ padding: 10 }}>
        <Flex>
          <Box flex={14}>
            <Box height="6">
              <Flex>
                <Box flex={9}>
                  <Text
                    color={'black'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                  >
                    {item?.product?.name}
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" color={'gray.500'}>
                    x {item?.amount}
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box height="7">
              {item?.product?.sale_price ? (
                <Flex>
                  <Text fontSize="sm" as="del" color={'#929292'}>
                    {formatMoney(item?.product?.price, 'USD')}
                  </Text>
                  <Text marginLeft={'2'} fontSize="sm" color={'green.500'}>
                    {formatMoney(item?.product?.sale_price, 'USD')}
                  </Text>
                </Flex>
              ) : (
                <Text fontSize="sm" color={'blackAlpha.700'}>
                  {formatMoney(item?.product?.price, 'USD')}
                </Text>
              )}
            </Box>
          </Box>
          <Center flex={1}>
            <Button
              borderRadius={0}
              m={'auto'}
              leftIcon={<CloseIcon />}
              colorScheme={'red'}
              variant={'link'}
              onClick={removeProductToStock}
            />
          </Center>
        </Flex>
      </div>
    </ListItem>
  )
}
