import {
  Box,
  Flex,
  Avatar,
  Image,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  chakra,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import R from 'shared/assets'
import NavLink from './NavLink'
import { paths } from 'routes/route-path'
import { useDispatch } from 'react-redux'
import { logoutAction } from 'features/auth/AuthSlice'
import { FaUserAlt } from 'react-icons/fa'
import { GrReturn } from 'react-icons/gr'
const CFaUserAlt = chakra(FaUserAlt)
const CGrReturn = chakra(GrReturn)

type HeaderRouteType = {
  name: string
  path: string
}

const HeaderRoutes: HeaderRouteType[] = [
  {
    name: 'Home',
    path: paths.HOME,
  },
  {
    name: 'My order',
    path: paths.MY_ORDER,
  },
]

export default function Header() {
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box bg={useColorModeValue('white', 'gray.100')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>
            <Image borderRadius="full" height={50} src={R.images.pc_logo} />
          </Box>
          {HeaderRoutes.map((item: HeaderRouteType) => (
            <NavLink key={item.path} href={item.path}>
              {item.name}
            </NavLink>
          ))}
        </HStack>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              <Avatar size={'sm'} src={R.images.pc_meme} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<CFaUserAlt />}>Profile</MenuItem>
              <MenuDivider />
              <MenuItem
                icon={<CGrReturn />}
                onClick={() => dispatch(logoutAction())}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {HeaderRoutes.map((item: HeaderRouteType) => (
              <NavLink key={item.path} href={item.path}>
                {item.name}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
