import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  Input,
  Button,
  InputGroup,
  Stack,
  Text,
  FormControl,
  FormErrorMessage,
  Flex,
  Divider,
  Center,
  useToast,
} from '@chakra-ui/react'
import {
  ProductStockInterface,
  clearProductAction,
} from '../../../home/OrderSlice'
import { useForm } from 'react-hook-form'
import { formatMoney } from 'shared/utils/format-money'
import { requestCreateOrder } from '../OrderApi'
import { alertSuccess } from 'shared/services/alerts/alert.service'
import { paths } from 'routes/route-path'

type FormValue = {
  note: string
  address: string
}
type SubmitFormOrderProps = {
  totalPrice: number
}
const toastDefaultOption: any = {
  duration: 2000,
  isClosable: true,
  position: 'top-right',
}

export default function SubmitFormOrder({ totalPrice }: SubmitFormOrderProps) {
  const history = useHistory()
  const dispatch = useDispatch()
  const toast = useToast()
  const productsStock: ProductStockInterface[] = useSelector(
    (state: any) => state.orderReducer.products
  )
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>()

  const onSubmit = async (data: FormValue) => {
    if (productsStock.length === 0)
      return toast({
        ...toastDefaultOption,
        title: 'Cant create order.',
        description: `You must add at least one product to order`,
        status: 'error',
      })
    const payload = {
      ...data,
      products: productsStock.map(product_stock => ({
        product_id: product_stock.product.id,
        amount: product_stock.amount,
      })),
    }
    try {
      const {
        data: { id, code },
      } = await requestCreateOrder(payload)
      dispatch(clearProductAction())
      reset({ note: '', address: '' })
      return alertSuccess(
        {
          title: 'Order created.',
          text: `Your order created with code: ${code}, would you like to see it?`,
          showCancelButton: true,
          confirmButtonText: 'Yes, see my order!',
          cancelButtonText: 'No, create another order!',
          reverseButtons: true,
        },
        result => result.isConfirmed && history.push(`${paths.MY_ORDER}/${id}`)
      )
    } catch (error) {
    } finally {
    }
  }
  return (
    <Stack spacing={3} backgroundColor="whiteAlpha.900">
      <Divider padding={0} />
      <Center backgroundColor="whiteAlpha.900">
        <Flex width={'96%'}>
          <Text color={'blackAlpha.800'}>Total:</Text>
          <Text color={'blackAlpha.700'}>
            <strong>{formatMoney(totalPrice, 'USD')}</strong>
          </Text>
        </Flex>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} p="1rem" boxShadow="md">
          <FormControl isInvalid={errors.note ? true : false}>
            <InputGroup>
              <Input
                color={'blackAlpha.800'}
                variant="outline"
                placeholder="Note"
                {...register('note', {})}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.note && errors.note?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.address ? true : false}>
            <InputGroup>
              <Input
                color={'blackAlpha.800'}
                variant="outline"
                placeholder="Address"
                {...register('address', {
                  required: {
                    value: true,
                    message: `Address is required`,
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.address && errors.address.message}
            </FormErrorMessage>
          </FormControl>
          <Divider padding={0} />
          <Button
            isLoading={isSubmitting}
            borderRadius={0}
            type="submit"
            variant="solid"
            colorScheme="teal"
            width="full"
          >
            Create Order
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}
