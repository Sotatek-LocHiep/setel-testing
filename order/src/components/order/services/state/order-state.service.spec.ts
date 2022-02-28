import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../../test/test.module';
import { OrderStateFactory } from '../../factories/order-state.factory';
import { OrderStateService } from './order-state.service';

describe('OrderStateService', () => {
  let service: OrderStateService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [OrderStateFactory, OrderStateService],
    }).compile();

    service = module.get<OrderStateService>(OrderStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
