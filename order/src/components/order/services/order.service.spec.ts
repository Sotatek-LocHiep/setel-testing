import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../../../config/configuration';
import validationSchema from '../../../../config/validationSchema';
import { ProductModule } from '../../../components/product/product.module';
import { AdapterModule } from '../adapters/adapter.module';
import { OrderStateFactory } from '../factories/order-state.factory';
import { OrderItemService } from './item/order-item.service';
import { OrderService } from './order.service';
import { OrderStateService } from './state/order-state.service';
import { ServicesModule } from '../../../shared/services/services.module';
describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ServicesModule,
        ProductModule,
        AdapterModule,
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
      providers: [OrderItemService, OrderStateService, OrderStateFactory, OrderService],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
