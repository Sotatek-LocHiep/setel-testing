import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { microServicesProvide } from '../../../../../shared/services/micro-service/micro-services.provider';
import { PaymentMicroServiceMethod } from './payment-micro-service.method';
describe('PaymentMicroServiceMethod', () => {
  let service: PaymentMicroServiceMethod;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
          expandVariables: true,
        }),
      ],
      providers: [...microServicesProvide, PaymentMicroServiceMethod],
    }).compile();

    service = module.get<PaymentMicroServiceMethod>(PaymentMicroServiceMethod);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // service payment must active to execute this test case
  it('should be execute payment success', async () => {
    const { data } = await service.pay(2);
    expect(data).toHaveProperty('success');
    expect(typeof data.success).toBe('boolean');
    if (!data.success) {
      expect(data).toHaveProperty('message');
    }
  });
});
