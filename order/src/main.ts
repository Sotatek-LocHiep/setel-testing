import * as dotenv from 'dotenv';
declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { initAdapters } from './adapters.init';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder().addBearerAuth().setTitle('Test Setel').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  initAdapters(app);
  await app.listen(process.env.PORT, () => console.log('Order service active at:', process.env.PORT));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
