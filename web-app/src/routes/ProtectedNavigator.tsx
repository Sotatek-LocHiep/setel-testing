import configuration from 'config/configuration'
import Cookies from 'js-cookie'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import Header from 'shared/components/Header'
import DeepRoutes from './DeepRoutes'
import { ProtectedComponents } from './protected-components'
import { paths } from './route-path'
import { getProfileAction } from 'features/auth/AuthSlice'
import { Divider, Box } from '@chakra-ui/react'

export default function ProtectedNavigator() {
  const history = useHistory()
  const dispatch = useDispatch()
  React.useEffect(() => {
    const session = Cookies.get(configuration.AUTHENTICATION_COOKIE_KEY)
    if (isEmpty(session)) history.push(paths.LOGIN)
    else dispatch(getProfileAction())
  }, [history, dispatch])
  return (
    <Box bg={'#f0f2f5'}>
      <Header />
      <Divider borderColor={'white'} />
      <DeepRoutes components={ProtectedComponents} />
    </Box>
  )
}
