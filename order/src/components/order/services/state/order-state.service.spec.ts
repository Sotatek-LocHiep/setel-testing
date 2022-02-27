import { Test, TestingModule } from '@nestjs/testing';
import { OrderStateService } from './order-state.service';
import { Repository } from 'typeorm';
import { OrderStateFactory } from '../../factories/order-state.factory';
import { OrderStateRepository } from '../../repositories/order-state.repository';

describe('OrderStateService', () => {
  let service: OrderStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderStateFactory,
        OrderStateService,
        {
          provide: 'Repository',
          useClass: OrderStateRepository,
        },
      ],
    }).compile();

    service = module.get<OrderStateService>(OrderStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
