import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { OrderController } from './controllers/order.controller';
import { OrderStateService } from './services/state/order-state.service';
import { OrderItemService } from './services/item/order-item.service';
import { OrderService } from './services/order.service';
import { OrderStateController } from './controllers/state/order-state.controller';
import { OrderStateFactory } from './factories/order-state.factory';
import { DeliveryOrderCron } from './crons/delivery-order.crons';
import { PaymentAdapterModule } from './payment-adapter/payment-adapter.module';
import { PaymentMicroServiceMethod } from './payment-adapter/methods/order-payment-micro-service/payment-micro-service.method';

@Module({
  exports: [DeliveryOrderCron],
  imports: [ProductModule, PaymentAdapterModule.registerAsync({ method: PaymentMicroServiceMethod })],
  providers: [OrderService, OrderItemService, OrderStateService, OrderStateFactory, DeliveryOrderCron],
  controllers: [OrderController, OrderStateController],
})
export class OrderModule {}
