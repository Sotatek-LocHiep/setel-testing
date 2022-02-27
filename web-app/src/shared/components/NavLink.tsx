import { ReactNode } from 'react'
import { Link, useColorModeValue } from '@chakra-ui/react'
export default function NavLink({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  return (
    <Link
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.400', 'gray.600'),
        color: useColorModeValue('white', 'gray.400'),
      }}
      href={href}
    >
      <strong> {children}</strong>
    </Link>
  )
}
