export type OrderCase = {
  status: boolean;
  message: string;
};
export const PaymentOrderCase: OrderCase[] = [
  {
    status: true,
    message: 'Payment success (by mock).',
  },
  {
    status: false,
    message: 'Order not found (by mock).',
  },
  {
    status: false,
    message: 'Invalid order status (by mock).',
  },
  {
    status: false,
    message: 'Your money not enough (by mock).',
  },
  {
    status: false,
    message: 'Expired payment (by mock).',
  },
];
export const getOrderPaymentCase = (orderId: number) => PaymentOrderCase[orderId % PaymentOrderCase.length];
