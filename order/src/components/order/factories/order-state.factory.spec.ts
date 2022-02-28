import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ORDER_STATUS } from '../constants';
import { OrderState } from '../entities/order-state.entity';
import { OrderStateFactory } from './order-state.factory';
describe('OrderStateFactory', () => {
  let service: OrderStateFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderStateFactory],
    }).compile();

    service = module.get<OrderStateFactory>(OrderStateFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // service payment must active to execute this test case
  it('should be return instance of OrderState with CREATED status', () => {
    const data = service.buildEntityCreatedState(1);
    expect(data instanceof OrderState).toBeTruthy();
    expect(data.status).toBe(ORDER_STATUS.CREATED);
  });
  it('should be return instance of OrderState with CONFIRMED status', () => {
    const data = service.buildEntityConfirmedState(1);
    expect(data instanceof OrderState).toBeTruthy();
    expect(data.status).toBe(ORDER_STATUS.CONFIRMED);
  });
  it('should be return instance of OrderState with DELIVERED status', () => {
    const data = service.buildEntityDeliveredState(1);
    expect(data instanceof OrderState).toBeTruthy();
    expect(data.status).toBe(ORDER_STATUS.DELIVERED);
  });
  it('should be return instance of OrderState with CANCELLED status', () => {
    const reject_reason = 'Test reject reason.';
    const data = service.buildEntityCanceledState(1, reject_reason);
    expect(data instanceof OrderState).toBeTruthy();
    expect(data.status).toBe(ORDER_STATUS.CANCELLED);
    expect(data.reject_reason).toBe(reject_reason);
  });
});
