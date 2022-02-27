import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, TcpOptions } from '@nestjs/microservices';

async function bootstrap() {
  const options = {
    host: '0.0.0.0',
    port: Number(process.env.PAYMENT_SERVICE_PORT),
  };
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options,
  } as TcpOptions);
  await app.listen(() => console.log('Payment service active: ', options));
}
bootstrap();
