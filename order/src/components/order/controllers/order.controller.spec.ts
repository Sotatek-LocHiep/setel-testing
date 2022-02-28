import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../test/test.module';
import { ProductService } from '../../../components/product/services/product.service';
import { ServicesModule } from '../../../shared/services/services.module';
import { OrderModule } from '../order.module';
import { OrderController } from './order.controller';

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, OrderModule, ServicesModule],
      providers: [ProductService],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
