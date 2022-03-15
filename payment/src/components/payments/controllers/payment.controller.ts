import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ServiceAuthGuard } from '../../auth/guards/service-auth.guard';
import { ExceptionFilter } from '../../../shared/filters/exception.filter';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { SERVICE_EVENTS } from '../constants';
import { PaymentService } from '../services/payment.service';

@Controller('api/v1/payment')
@UseGuards(ServiceAuthGuard)
export class PaymentController {
  constructor(private response: ApiResponseService, private paymentService: PaymentService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern(SERVICE_EVENTS.CREATE_PAYMENT)
  public async payment(order_id: number): Promise<{ [key: string]: any }> {
    const result = await this.paymentService.payment(order_id);
    if (result.status) return this.response.success({ order_id });
    return this.response.failure({ order_id }, result.message);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern(SERVICE_EVENTS.REFUND_PAYMENT)
  public async refund(order_id: number): Promise<{ [key: string]: any }> {
    await this.paymentService.refund(order_id);
    return this.response.success({ order_id });
  }
}
