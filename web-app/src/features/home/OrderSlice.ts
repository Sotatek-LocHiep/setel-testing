import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductInterface } from './product/product-interface'

export interface ProductStockInterface {
  product: ProductInterface
  amount: number
}

interface OrderStateInterface {
  products: ProductStockInterface[]
}

const initialState: OrderStateInterface = {
  products: [],
}

export const authSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addProductAction: (state, action: PayloadAction<ProductStockInterface>) => {
      const productStockExisted = state.products.find(
        product_stock => product_stock.product.id === action.payload.product.id
      )
      if (!productStockExisted) state.products.push(action.payload)
      else {
        const total = productStockExisted.amount + action.payload.amount
        if (total > action.payload.product.amount)
          productStockExisted.amount = action.payload.product.amount
        else productStockExisted.amount = total
      }
    },
    removeProductAction: (state, action: PayloadAction<{ id: number }>) => {
      const products = state.products.filter(
        product_stock => product_stock.product.id !== action.payload.id
      )
      state.products = products
    },
    clearProductAction: (state, action: PayloadAction) => {
      state.products = initialState.products
    },
  },
})

export const { actions, reducer } = authSlice
export const {
  addProductAction,
  removeProductAction,
  clearProductAction,
} = actions
export default reducer
