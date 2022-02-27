import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import configuration from 'config/configuration'
import Cookie from 'js-cookie'
import { paths } from 'routes/route-path'
import { requestGetProfile } from './AuthApi'
import { ProfileType } from './AuthApi'

type AuthSliceStateType = {
  isLoading: boolean
  dialogLoading: boolean
  profile: ProfileType | null
}

const initialState: AuthSliceStateType = {
  isLoading: false,
  dialogLoading: false,
  profile: null,
}

export const getProfileAction = createAsyncThunk(
  'auth/profile',
  async (payload, thunkApi) => {
    const result = await requestGetProfile()
    return result.data
  }
)

export const logoutAction = createAsyncThunk('auth/logout', async () => {})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoadingAction: (state, action) => {
      state.isLoading = !state.isLoading
    },
    setDialogLoadingAction: (state, action) => {
      state.dialogLoading = !state.dialogLoading
    },
  },
  extraReducers: builder => {
    builder.addCase(getProfileAction.pending, (state, action) => {
      state.isLoading = true
      return state
    })
    builder.addCase(getProfileAction.fulfilled, (state, action) => {
      state.profile = action.payload
      state.isLoading = false
      return state
    })
    builder.addCase(getProfileAction.rejected, (state, action) => {
      state.isLoading = false
      state.profile = null
      return state
    })
    builder.addCase(logoutAction.pending, (state, action) => {
      state.isLoading = true
      return state
    })
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state = initialState
      Cookie.remove(configuration.AUTHENTICATION_COOKIE_KEY)
      window.location.href = paths.LOGIN
      return state
    })
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.isLoading = false
      return state
    })
  },
})

export const { actions, reducer } = authSlice
export const { setLoadingAction, setDialogLoadingAction } = actions
export default reducer
