import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
