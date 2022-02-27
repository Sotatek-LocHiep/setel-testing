import {
  Box,
  ButtonProps,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  List,
  Text,
} from '@chakra-ui/react'
import {
  Container,
  Next,
  PageGroup,
  Paginator,
  Previous,
  usePaginator,
} from 'chakra-paginator'
import React from 'react'
import R from 'shared/assets'
import Spinner from 'shared/components/Spinner'
import { useSpinner } from 'shared/components/Spinner/hooks/useSpinner'
import ProductItem from './components/ProductItem'
import { ProductInterface } from './product-interface'
import { requestGetProducts } from './ProductApi'
// styles
const baseStyles: ButtonProps = {
  w: 7,
  fontSize: 'sm',
}

const normalStyles: ButtonProps = {
  ...baseStyles,
  _hover: {
    bg: 'green.300',
  },
  bg: 'white',
  color: 'black',
}

const activeStyles: ButtonProps = {
  ...baseStyles,
  _hover: {
    bg: 'blue.300',
  },
  bg: 'green.300',
}

const separatorStyles: ButtonProps = {
  w: 7,
  bg: 'green.200',
}
// constants
const outerLimit = 2
const innerLimit = 2

export default function Product() {
  const [products, setProducts] = React.useState<ProductInterface[]>([])
  const [productsTotal, setProductsTotal] = React.useState<number | undefined>(
    undefined
  )
  const { isSpin, activeSpinner, inactiveSpinner } = useSpinner()
  const {
    isDisabled,
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    offset,
  } = usePaginator({
    total: productsTotal,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  })
  React.useEffect(() => {
    getProducts(currentPage)
  }, [currentPage, pageSize, offset])

  const getProducts = async (page: number) => {
    activeSpinner()
    try {
      const {
        data,
        meta: { pagination },
      } = await requestGetProducts({ page })
      setProducts(data)
      setProductsTotal(pagination.total)
    } catch (error) {
    } finally {
      inactiveSpinner()
    }
  }

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
          <Image boxSize="30" objectFit="cover" src={R.images.ic_motorbike} />
          <Text paddingTop={1} marginLeft={3}>
            Products
          </Text>
        </Flex>
      </Heading>
      <Divider />
      {isSpin ? (
        <Center height={'590'}>
          <Spinner />
        </Center>
      ) : (
        <List overflow={'auto'} spacing={1} height={'590'}>
          {products.length > 0 ? (
            products?.map((product: ProductInterface) => (
              <ProductItem key={product.id} item={product} />
            ))
          ) : (
            <Center marginTop={'20'}>
              <Text color={'blackAlpha.600'} fontSize={'large'}>
                No product
              </Text>
            </Center>
          )}
        </List>
      )}
      <Divider />
      <Paginator
        isDisabled={isDisabled}
        activeStyles={activeStyles}
        innerLimit={innerLimit}
        currentPage={currentPage}
        outerLimit={outerLimit}
        normalStyles={normalStyles}
        separatorStyles={separatorStyles}
        pagesQuantity={pagesQuantity}
        onPageChange={setCurrentPage}
      >
        <Container align="center" justify="space-between" w="full" p={4}>
          <Previous>
            <Text color={'blackAlpha.800'}>Previous</Text>
          </Previous>
          <PageGroup isInline align="center" />
          <Next>
            <Text color={'blackAlpha.800'}>Next</Text>
          </Next>
        </Container>
      </Paginator>
    </Box>
  )
}
