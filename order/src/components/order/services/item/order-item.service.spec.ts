import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../../test/test.module';
import { OrderItemService } from './order-item.service';

describe('OrderItemService', () => {
  let service: OrderItemService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [OrderItemService],
    }).compile();
    service = module.get<OrderItemService>(OrderItemService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
