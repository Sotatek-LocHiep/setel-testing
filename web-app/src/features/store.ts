import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from './auth/AuthSlice'
import OrderReducer from './home/OrderSlice'

export default configureStore({
  reducer: {
    authReducer: AuthReducer,
    orderReducer: OrderReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  enhancers: [],
})
