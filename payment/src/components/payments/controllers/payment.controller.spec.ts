import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { PaymentService } from '../services/payment.service';
import { PaymentController } from './payment.controller';

describe('Order Controller', () => {
  let controller: PaymentController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService, ApiResponseService],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be return payment result', async () => {
    const { data } = await controller.payment(1);
    expect(data).toHaveProperty('success');
    expect(typeof data.success).toBe('boolean');
    if (!data.success) {
      expect(data).toHaveProperty('message');
    }
  });

  it('should be return refund result', async () => {
    const { data } = await controller.refund(1);
    expect(data).toHaveProperty('success');
    expect(typeof data.success).toBe('boolean');
  });
});
