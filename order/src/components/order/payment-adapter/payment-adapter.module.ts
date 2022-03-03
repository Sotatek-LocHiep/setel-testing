import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { IPaymentMethod } from './interfaces/payment-method.interface';
import { PaymentAdapter } from './payment.adapter';

export interface PaymentAsyncOption extends Pick<ModuleMetadata, 'imports'> {
  method: Type<IPaymentMethod>;
}
@Module({
  providers: [PaymentAdapter],
  exports: [PaymentAdapter],
})
export class PaymentAdapterModule {
  public static registerAsync(options: PaymentAsyncOption): DynamicModule {
    return {
      module: PaymentAdapterModule,
      imports: options.imports || [],
      providers: [
        options.method,
        {
          provide: PaymentAdapter,
          useFactory: (method: IPaymentMethod) => {
            return new PaymentAdapter(method);
          },
          inject: [options.method],
        },
      ],
      exports: [PaymentAdapter],
    };
  }
}
