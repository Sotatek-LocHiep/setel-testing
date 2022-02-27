import { Spinner as CSpinner } from '@chakra-ui/react'

export default function Spinner() {
  return (
    <CSpinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  )
}
