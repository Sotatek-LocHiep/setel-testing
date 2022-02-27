import { Module } from '@nestjs/common';
import { OrderController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [],
  providers: [PaymentService],
  controllers: [OrderController],
})
export class PaymentModule {}
