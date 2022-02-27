import { Injectable } from '@nestjs/common';

import { IPaymentAdapter } from './interfaces/payment-adapter.interface';
import { IPaymentMethod } from './interfaces/payment-method.interface';

@Injectable()
export class PaymentAdapter implements IPaymentAdapter {
  method: IPaymentMethod;
  constructor(method: IPaymentMethod) {
    this.method = method;
  }
  async execute(order_id: number) {
    return this.method.pay(order_id);
  }
}
