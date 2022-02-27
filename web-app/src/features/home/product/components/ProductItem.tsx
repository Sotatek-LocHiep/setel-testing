import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ListItem,
  Box,
  Flex,
  Text,
  Divider,
  Button,
  Input,
  chakra,
  useToast,
} from '@chakra-ui/react'
import { min } from 'lodash'
import { ProductInterface } from '../product-interface'
import { formatMoney } from 'shared/utils/format-money'
import { addProductAction, ProductStockInterface } from '../../OrderSlice'
import { BsCartPlus } from 'react-icons/bs'
const CBsCartPlus = chakra(BsCartPlus)

type ProductItemProps = {
  item: ProductInterface
}
const toastDefaultOption: any = {
  duration: 2000,
  isClosable: true,
  position: 'top-right',
}

export default function ProductItem({ item }: ProductItemProps) {
  const dispatch = useDispatch()
  const toast = useToast()
  const productsStock: ProductStockInterface[] = useSelector(
    (state: any) => state.orderReducer.products
  )
  const refInputAmount: any = React.useRef(null)
  const increaseAmount = () => {
    if (
      refInputAmount.current &&
      Number(refInputAmount.current.value) < item.amount
    )
      refInputAmount.current.value = Number(refInputAmount.current.value) + 1
  }
  const decreaseAmount = () => {
    if (refInputAmount.current && Number(refInputAmount.current.value) > 0)
      refInputAmount.current.value = Number(refInputAmount.current.value) - 1
  }
  const checkIsAddedFull = () => {
    const productStockExisted = productsStock.find(
      product_stock => product_stock.product.id === item.id
    )
    return productStockExisted?.amount === item.amount
  }
  const getAmountCanAdd = (): number => {
    const productStockExisted = productsStock.find(
      product_stock => product_stock.product.id === item.id
    )
    if (productStockExisted) {
      return item.amount - productStockExisted?.amount
    } else return item.amount
  }

  const addProductToStock = () => {
    const amount = Number(refInputAmount.current.value)
    if (amount && amount > 0) {
      const canAdd = getAmountCanAdd()
      const data = {
        product: item,
        amount,
      }
      dispatch(addProductAction(data))
      if (checkIsAddedFull()) {
        toast({
          ...toastDefaultOption,
          title: 'Stock is full this product.',
          description: `Cant add more ${item.name} to stocks`,
          status: 'error',
        })
      } else {
        toast({
          ...toastDefaultOption,
          title: 'Added product to stock.',
          description: `Added ${min([amount, canAdd])} ${item.name} to stock`,
          status: 'success',
        })
      }
    } else {
      toast({
        ...toastDefaultOption,
        title: 'Invalid amount.',
        description: 'Amount product must be than 0',
        status: 'error',
      })
    }
  }
  return (
    <ListItem
      bg={'white'}
      borderRadius={'md'}
      marginLeft={'2%'}
      width={'96%'}
      paddingBottom={'5'}
    >
      <div style={{ padding: 10 }}>
        <Box height="7">
          <Text
            color={'black'}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
            whiteSpace={'nowrap'}
          >
            {item.name}
          </Text>
        </Box>
        <Box height="7">
          {item.sale_price ? (
            <Flex>
              <Text fontSize="sm" as="del" color={'#929292'}>
                {formatMoney(item.price, 'USD')}
              </Text>
              <Text marginLeft={'2'} fontSize="sm" color={'green.500'}>
                {formatMoney(item.sale_price, 'USD')}
              </Text>
            </Flex>
          ) : (
            <Text fontSize="sm" color={'blackAlpha.700'}>
              {formatMoney(item.price, 'USD')}
            </Text>
          )}
        </Box>
      </div>
      <Divider borderColor={'gainsboro'} />
      <Box height="7" padding={'3'}>
        <Flex>
          <Box>
            <Button
              onClick={decreaseAmount}
              size={'sm'}
              color={'blackAlpha.600'}
            >
              -
            </Button>
            <Input
              ref={refInputAmount}
              textAlign={'center'}
              defaultValue={'0'}
              padding={'1'}
              size={'sm'}
              color={'blackAlpha.800'}
              width={'10'}
              type={'number'}
              onChange={event => {
                const value = Number(event.target.value)
                if (value < 0) refInputAmount.current.value = 0
                else if (value > item.amount)
                  refInputAmount.current.value = item.amount
                else refInputAmount.current.value = value
              }}
            />
            <Button
              onClick={increaseAmount}
              size={'sm'}
              color={'blackAlpha.600'}
            >
              +
            </Button>
          </Box>
          <Box marginLeft={4}>
            <Text
              color={'gray.400'}
              textAlign={'center'}
              paddingTop={'1'}
              fontSize={'sm'}
            >
              {item.amount} available
            </Text>
          </Box>
          <Box flex={'5'}>
            <Button
              mr={2}
              float={'right'}
              size={'sm'}
              color={'blackAlpha.600'}
              flex={'end'}
              leftIcon={<CBsCartPlus />}
              border={'none'}
              outline={'none'}
              onClick={addProductToStock}
            >
              Add to stock
            </Button>
          </Box>
        </Flex>
      </Box>
    </ListItem>
  )
}
