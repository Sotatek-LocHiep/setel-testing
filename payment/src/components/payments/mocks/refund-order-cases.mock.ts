export type RefundCase = {
  message: string;
};

export const RefundOrderCase: RefundCase[] = [
  {
    message: 'Refund success (by mock).',
  },
];
export const getOrderRefundCase = (orderId: number) => RefundOrderCase[orderId % RefundOrderCase.length];
