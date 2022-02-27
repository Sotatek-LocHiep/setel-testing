import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComponentsModule } from './components/components.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, ConfigModule.forRoot(), ComponentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
