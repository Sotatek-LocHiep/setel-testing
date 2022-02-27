import { Injectable } from '@nestjs/common';
import { getOrderPaymentCase, OrderCase } from '../mocks/payment-order-cases.mock';
import { getOrderRefundCase, RefundCase } from '../mocks/refund-order-cases.mock';

@Injectable()
export class PaymentService {
  payment(order_id: number): Promise<OrderCase> {
    // do payment business
    return new Promise((resolve, reject) => {
      const radInt = Math.floor(Math.random() * 100) + order_id;
      const orderPaymentCase = getOrderPaymentCase(radInt);
      resolve(orderPaymentCase);
    });
  }

  refund(order_id: number): Promise<RefundCase> {
    // do refund business
    return new Promise((resolve, reject) => {
      const radInt = Math.floor(Math.random() * 100) + order_id;
      const orderRefundCase = getOrderRefundCase(radInt);
      resolve(orderRefundCase);
    });
  }
}
