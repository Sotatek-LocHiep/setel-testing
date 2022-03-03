import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Not } from 'typeorm';
import { TestModule } from '../../../../test/test.module';
import { ServicesModule } from '../../../shared/services/services.module';
import { ProductService } from '../../product/services/product.service';
import { OrderStateFactory } from '../factories/order-state.factory';
import { PaymentMicroServiceMethod } from '../payment-adapter/methods/order-payment-micro-service/payment-micro-service.method';
import { PaymentAdapterModule } from '../payment-adapter/payment-adapter.module';
import { PaymentAdapter } from '../payment-adapter/payment.adapter';
import { OrderItemService } from './item/order-item.service';
import { OrderService } from './order.service';
import { OrderStateService } from './state/order-state.service';

describe('OrderService', () => {
  let service: OrderService;
  let paymentAdapter: PaymentAdapter;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, ServicesModule, PaymentAdapterModule.registerAsync({ method: PaymentMicroServiceMethod })],
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
  it('should be return truthy ownership status order', async () => {
    const order = await service.first({ where: { id: Not(0) } });
    expect(await service.checkOwnership(order.id, order.user_id)).not.toThrow(ForbiddenException);
  });
  it('should be return falsy ownership status order', async () => {
    const order = await service.first({ where: { id: Not(0) } });
    expect(await service.checkOwnership(order.id, order.user_id + 1)).toThrow(ForbiddenException);
  });
});
