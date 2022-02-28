import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../test/test.module';
import { ProductModule } from '../../../components/product/product.module';
import { ServicesModule } from '../../../shared/services/services.module';
import { AdapterModule } from '../adapters/adapter.module';
import { OrderStateFactory } from '../factories/order-state.factory';
import { OrderItemService } from './item/order-item.service';
import { OrderService } from './order.service';
import { OrderStateService } from './state/order-state.service';
describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServicesModule, ProductModule, AdapterModule, TestModule],
      providers: [OrderItemService, OrderStateService, OrderStateFactory, OrderService],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
