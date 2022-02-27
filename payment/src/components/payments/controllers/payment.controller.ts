import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilter } from 'src/shared/filters/exception.filter';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { SERVICE_EVENTS } from '../constants';
import { PaymentService } from '../services/payment.service';

@Controller('api/v1/payment')
export class OrderController {
  constructor(private response: ApiResponseService, private paymentService: PaymentService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern(SERVICE_EVENTS.CREATE_PAYMENT)
  public async payment(order_id: number): Promise<{ [key: string]: any }> {
    const result = await this.paymentService.payment(order_id);
    if (result.status) return this.response.success();
    return this.response.failure(result.message);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern(SERVICE_EVENTS.REFUND_PAYMENT)
  public async refund(order_id: number): Promise<{ [key: string]: any }> {
    const result = await this.paymentService.payment(order_id);
    if (result.status) return this.response.success();
    return this.response.failure(result.message);
  }
}
