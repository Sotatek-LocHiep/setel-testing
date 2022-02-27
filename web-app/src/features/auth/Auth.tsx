import { Flex } from '@chakra-ui/react'
import DeepRoutes from 'routes/DeepRoutes'
import { DeepRoutesComponentsType } from 'routes/type'
import { paths } from 'routes/route-path'
import Login from './components/Login'
import Register from './components/Register'
import React from 'react'
import Cookies from 'js-cookie'
import configuration from 'config/configuration'
import { useHistory } from 'react-router-dom'
import { isEmpty } from 'lodash'
const childAuthRoutes: DeepRoutesComponentsType[] = [
  { isProtect: false, path: paths.LOGIN, component: Login, exact: true },
  { isProtect: false, path: paths.REGISTER, component: Register, exact: true },
]

export default function Auth() {
  const history = useHistory()
  React.useEffect(() => {
    const session = Cookies.get(configuration.AUTHENTICATION_COOKIE_KEY)
    if (!isEmpty(session)) history.push(paths.HOME)
  }, [history])
  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <DeepRoutes components={childAuthRoutes} />
    </Flex>
  )
}
