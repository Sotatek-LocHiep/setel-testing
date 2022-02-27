import { IPaymentMethod } from './payment-method.interface';
import { IResponsePaymentService } from './response-payment-service.interface';

export interface IPaymentAdapter {
  method: IPaymentMethod;
  execute(order_id: number): Promise<IResponsePaymentService>;
}
