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
import { requestRegister } from '../AuthApi'
import { paths } from 'routes/route-path'
import Cookies from 'js-cookie'
import configuration from 'config/configuration'
import { alertSuccess } from 'shared/services/alerts/alert.service'

const CFaUserAlt = chakra(FaUserAlt)
const CFaLock = chakra(FaLock)

type FormValue = {
  username: string
  password: string
  confirm: string
}

export default function Register() {
  const history = useHistory()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setConfirm] = React.useState(false)
  const password = React.useRef({})
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValue>()
  password.current = watch('password', '')

  const onSubmit = async (data: FormValue) => {
    try {
      const {
        data: { token },
      } = await requestRegister(data)
      Cookies.set(configuration.AUTHENTICATION_COOKIE_KEY, token)
      alertSuccess({
        title: 'Registered successfully',
        text: 'Your account has been successfully registered.',
        didDestroy: () => history.push(paths.HOME),
      })
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
        <Heading color="teal.400">Create your account</Heading>
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
              <FormControl isInvalid={errors.password ? true : false}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm password"
                    {...register('confirm', {
                      required: {
                        value: true,
                        message: `Confirm password is required`,
                      },
                      validate: (value: string) =>
                        value === password.current ||
                        'Confirm passwords do not match',
                      minLength: {
                        value: 6,
                        message: `Confirm password must be than 6`,
                      },
                      maxLength: {
                        value: 30,
                        message: `Confirm password must be less than 30`,
                      },
                    })}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setConfirm(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.confirm && errors.confirm.message}
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
                Register
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        Already have login and password?{' '}
        <Link color="teal.500" href={paths.LOGIN}>
          Login
        </Link>
      </Box>
    </>
  )
}
