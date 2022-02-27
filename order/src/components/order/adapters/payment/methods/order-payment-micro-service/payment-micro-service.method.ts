import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICES } from '../../../../../../shared/services/micro-service/micro-services.provider';
import { SERVICE_EVENTS } from '../../../../constants';
import { IPaymentMethod } from '../../interfaces/payment-method.interface';

@Injectable()
export class PaymentMicroServiceMethod implements IPaymentMethod {
  constructor(@Inject(SERVICES.PAYMENT_SERVICE) private readonly paymentService: ClientProxy) {}
  async pay(order_id: number) {
    try {
      const result = await firstValueFrom(this.paymentService.send(SERVICE_EVENTS.CREATE_PAYMENT, order_id));
      return result;
    } catch (error) {
      const mgs =
        error.code === 'ECONNREFUSED'
          ? 'Internal payment service not response.'
          : 'Internal payment service got some error.';
      throw new ServiceUnavailableException(mgs);
    }
  }
}
