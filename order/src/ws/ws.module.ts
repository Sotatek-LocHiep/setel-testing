import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { EventsGateway } from './ws.gateway';

@Module({
  exports: [WsService],
  providers: [WsService, EventsGateway],
})
export class WsModule {}
