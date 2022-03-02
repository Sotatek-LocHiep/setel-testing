import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { OrderController } from './controllers/order.controller';
import { OrderStateService } from './services/state/order-state.service';
import { OrderItemService } from './services/item/order-item.service';
import { OrderService } from './services/order.service';
import { OrderStateController } from './controllers/state/order-state.controller';
import { AdapterModule } from './adapters/adapter.module';
import { OrderStateFactory } from './factories/order-state.factory';
import { ExecuteOrderPaymentCron } from './crons/execute-order-payment.crons';

@Module({
  imports: [ProductModule, AdapterModule],
  providers: [OrderService, OrderItemService, OrderStateService, OrderStateFactory, ExecuteOrderPaymentCron],
  controllers: [OrderController, OrderStateController],
})
export class OrderModule {}
