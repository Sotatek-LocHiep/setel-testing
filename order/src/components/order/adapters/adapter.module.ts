import { Module } from '@nestjs/common';
import { PaymentMicroServiceMethod } from './payment/methods/order-payment-micro-service/payment-micro-service.method';
import { PaymentAdapter } from './payment/payment.adapter';
import { IPaymentMethod } from './payment/interfaces/payment-method.interface';
/**
 * we can change PaymentMicroServiceMethod by another methods implement IPaymentMethod
 */
const PaymentMethod = PaymentMicroServiceMethod;
@Module({
  providers: [
    PaymentMethod,
    {
      provide: PaymentAdapter,
      useFactory: (method: IPaymentMethod) => {
        return new PaymentAdapter(method);
      },
      inject: [PaymentMethod],
    },
  ],
  exports: [PaymentAdapter],
})
export class AdapterModule {}
