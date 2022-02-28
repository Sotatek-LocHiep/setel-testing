import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../../test/test.module';
import { OrderState } from '../../entities/order-state.entity';
import { OrderStateFactory } from '../../factories/order-state.factory';
import { OrderStateService } from './order-state.service';

export function getLastOrderStateStatus(states: OrderState[]): OrderState {
  const lastState = states.reduce((prev, current) => (prev.id > current.id ? prev : current), states[0]);
  return lastState;
}

describe('OrderStateService', () => {
  let service: OrderStateService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [OrderStateFactory, OrderStateService],
    }).compile();

    service = module.get<OrderStateService>(OrderStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be return last order state', async () => {
    // provide exited order id
    const order_id = 63;
    const states = await service.getAll(order_id);
    const last = getLastOrderStateStatus(states);
    const state = await service.getLastOrderState(order_id);
    expect(state.id).toBe(last.id);
  });
});
