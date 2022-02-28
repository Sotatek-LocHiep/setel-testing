import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../../test/test.module';
import { ProductService } from '../../../../components/product/services/product.service';
import { ServicesModule } from '../../../../shared/services/services.module';
import { OrderModule } from '../../order.module';
import { OrderStateController } from './order-state.controller';

describe('OrderStateController', () => {
  let controller: OrderStateController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrderModule, ServicesModule, TestModule],
      providers: [ProductService],
    }).compile();

    controller = module.get<OrderStateController>(OrderStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
