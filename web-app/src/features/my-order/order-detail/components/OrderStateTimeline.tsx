import { Box, chakra, Grid, GridItem, Text } from '@chakra-ui/react'
import { ORDER_STATUS } from 'features/home/order/constants'
import { OrderStateInterface } from 'features/home/order/order-interface'
import { buildStringStateOrder } from 'features/my-order/utils/build-string-order-state'
import React from 'react'
import { FaRegCircle } from 'react-icons/fa'
import { formatDateToCleanString } from 'shared/utils/format-date'

const CFaRegCircle = chakra(FaRegCircle)

function TimelineItem({ state }: { state: OrderStateInterface }) {
  const circleColor = React.useMemo(() => {
    switch (state.status) {
      case ORDER_STATUS.CREATED:
        return 'green'
      case ORDER_STATUS.CONFIRMED:
        return 'gold'
      case ORDER_STATUS.DELIVERED:
        return 'blue'
      case ORDER_STATUS.CANCELLED:
        return 'red'
      default:
        return 'black'
    }
  }, [state.status])
  return (
    <Box>
      <Grid templateColumns="repeat(7, 1fr)" gap={6} padding={2}>
        <GridItem colSpan={2}>{buildStringStateOrder(state.status)}</GridItem>
        <GridItem colSpan={1}>
          <CFaRegCircle margin={1.5} boxSize={3} color={circleColor} />
        </GridItem>
        <GridItem colSpan={4}>
          <Text>{formatDateToCleanString(state.created_at)}</Text>
        </GridItem>
      </Grid>
      {state.reject_reason && (
        <Text marginLeft={2}>Reason: {state.reject_reason}</Text>
      )}
    </Box>
  )
}

interface OrderStateTimelineProps {
  states?: OrderStateInterface[]
}
export default function OrderStateTimeline({
  states,
}: OrderStateTimelineProps) {
  const States = React.useMemo(
    () => states?.map(state => <TimelineItem key={state.id} state={state} />),
    [states?.length]
  )
  return <Box padding={5}>{States}</Box>
}
