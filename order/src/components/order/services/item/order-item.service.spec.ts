import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../../../../config/configuration';
import validationSchema from '../../../../../config/validationSchema';
import { OrderItemService } from './order-item.service';

describe('OrderItemService', () => {
  let service: OrderItemService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          validationSchema: validationSchema,
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
          expandVariables: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => config.get('database'),
          inject: [ConfigService],
        }),
      ],
      providers: [OrderItemService],
    }).compile();
    service = module.get<OrderItemService>(OrderItemService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
