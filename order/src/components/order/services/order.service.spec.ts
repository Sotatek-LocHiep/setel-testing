import { Test, TestingModule } from '@nestjs/testing';
import { Not } from 'typeorm';
import { TestModule } from '../../../../test/test.module';
import { ServicesModule } from '../../../shared/services/services.module';
import { ProductService } from '../../product/services/product.service';
import { AdapterModule } from '../adapters/adapter.module';
import { PaymentAdapter } from '../adapters/payment/payment.adapter';
import { ORDER_STATUS } from '../constants';
import { OrderState } from '../entities/order-state.entity';
import { OrderStateFactory } from '../factories/order-state.factory';
import { OrderItemService } from './item/order-item.service';
import { OrderService } from './order.service';
import { OrderStateService } from './state/order-state.service';

describe('OrderService', () => {
  let service: OrderService;
  let paymentAdapter: PaymentAdapter;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, ServicesModule, AdapterModule],
      providers: [ProductService, OrderItemService, OrderStateService, OrderStateFactory, OrderService],
    }).compile();
    service = module.get<OrderService>(OrderService);
    paymentAdapter = module.get<PaymentAdapter>(PaymentAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentAdapter).toBeDefined();
  });
  it('should be show order', async () => {
    const item = await service.show(1);
    expect(item).toBeDefined();
  });
  it('should be created order', async () => {
    const item = await service.create({
      user_id: 1,
      note: 'nothing',
      address: 'USA',
      products: [
        { product_id: 1, amount: 1 },
        { product_id: 2, amount: 2 },
      ],
    });
    expect(item).toBeDefined();
  });
  it('should be confirm and return state order confirm', async () => {
    // provide existed order id with CREATED state
    const order_id = 63;
    const state = await service.confirmAndPay(order_id);
    expect(state).toBeInstanceOf(OrderState);
    expect(state.status).toBe(ORDER_STATUS.DELIVERED);
  });
  it('should call the paymentAdapter execute() method when calling the confirmAndPay() method', async () => {
    // provide existed order id with CREATED state
    const order_id = 63;
    const spyService = jest.spyOn(paymentAdapter, 'execute');
    await service.confirmAndPay(order_id);
    expect(spyService).toHaveBeenCalledTimes(1);
  });
  it('should be return truthy ownership status order', async () => {
    const order = await service.first({ where: { id: Not(0) } });
    const check = await service.checkOwnership(order.id, order.user_id);
    expect(check).toBeTruthy();
  });
  it('should be return falsy ownership status order', async () => {
    const order = await service.first({ where: { id: Not(0) } });
    const check = await service.checkOwnership(order.id, order.user_id + 1);
    expect(check).toBeFalsy();
  });
});
