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
    message: 'Your money not enough (by mock).',
  },
];
export const getOrderPaymentCase = (orderId: number) => PaymentOrderCase[orderId % PaymentOrderCase.length];
