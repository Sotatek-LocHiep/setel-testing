import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WsService } from './ws.service';

@WebSocketGateway()
export class EventsGateway {
  constructor(private readonly wsService: WsService) {}
  @SubscribeMessage('get-hello')
  public getHello(): string {
    return this.wsService.getHello();
  }
}
