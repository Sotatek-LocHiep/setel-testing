import React from 'react'
import { useHistory } from 'react-router-dom'
import {
  Link,
  Heading,
  Avatar,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Box,
  FormControl,
  InputRightElement,
  FormErrorMessage,
  chakra,
} from '@chakra-ui/react'
import { FaUserAlt, FaLock } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { requestLogin } from '../AuthApi'
import Cookies from 'js-cookie'
import configuration from 'config/configuration'
import { paths } from 'routes/route-path'

const CFaUserAlt = chakra(FaUserAlt)
const CFaLock = chakra(FaLock)

type FormValue = {
  username: string
  password: string
}

export default function Login() {
  const history = useHistory()

  const [showPassword, setShowPassword] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>()

  const onSubmit = async (data: FormValue) => {
    try {
      const {
        data: { token },
      } = await requestLogin(data)
      Cookies.set(configuration.AUTHENTICATION_COOKIE_KEY, token)
      history.push(paths.HOME)
    } catch (error) {}
  }

  return (
    <>
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl isInvalid={errors.username ? true : false}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Username"
                    {...register('username', {
                      required: {
                        value: true,
                        message: `Username is required`,
                      },
                      minLength: {
                        value: 6,
                        message: `Username must be than 6`,
                      },
                      maxLength: {
                        value: 30,
                        message: `Username must be less than 30`,
                      },
                    })}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.username && errors.username?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password ? true : false}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password', {
                      required: {
                        value: true,
                        message: `Password is required`,
                      },
                      minLength: {
                        value: 6,
                        message: `Password must be than 6`,
                      },
                      maxLength: {
                        value: 30,
                        message: `Password must be less than 30`,
                      },
                    })}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                isLoading={isSubmitting}
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{' '}
        <Link color="teal.500" href={paths.REGISTER}>
          Sign Up
        </Link>
      </Box>
    </>
  )
}
