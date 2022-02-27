import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export enum SERVICES {
  PAYMENT_SERVICE = 'PAYMENT_SERVICE',
}

export const microServicesProvide = [
  {
    provide: SERVICES.PAYMENT_SERVICE,
    useFactory: () => {
      return ClientProxyFactory.create({
        options: {
          port: Number(process.env.PAYMENT_SERVICE_PORT),
          host: process.env.PAYMENT_SERVICE_HOST,
        },
        transport: Transport.TCP,
      });
    },
    inject: [],
  },
];
