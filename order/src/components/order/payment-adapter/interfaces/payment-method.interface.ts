import { IResponsePaymentService } from './response-payment-service.interface';

export interface IPaymentMethod {
  pay(order_id: number): Promise<IResponsePaymentService>;
}
