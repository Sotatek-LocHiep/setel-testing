import { INestApplication } from '@nestjs/common';
import { WsService } from './ws/ws.service';
import { WsAdapter } from './ws/ws.adapter';
import { DeliveryOrderCron } from './components/order/crons/delivery-order.crons';

export const initAdapters = (app: INestApplication): INestApplication => {
  const wsService = app.get(WsService);
  const deliveryOrderCron = app.get(DeliveryOrderCron);
  app.useWebSocketAdapter(new WsAdapter(app, wsService, deliveryOrderCron));
  return app;
};
