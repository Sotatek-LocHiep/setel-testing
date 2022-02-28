import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { OrderCase } from '../mocks/payment-order-cases.mock';
describe('PaymentService', () => {
  let service: PaymentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return state payment', async () => {
    const result = await service.payment(1);
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('message');
    expect(typeof result.status).toBe('boolean');
  });
  it('should be return state refund', async () => {
    const result = await service.refund(1);
    expect(result).toHaveProperty('message');
  });
});
