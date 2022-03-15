import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { pick } from 'lodash';
import { Server } from 'socket.io';
import { WS_EVENTS } from 'src/ws/events';
import { OrderStateFactory } from '../factories/order-state.factory';
import { OrderService } from '../services/order.service';
import { OrderStateService } from '../services/state/order-state.service';
@Injectable()
export class DeliveryOrderCron {
  private ioServer: Server;
  constructor(
    private readonly orderService: OrderService,
    private readonly orderStateService: OrderStateService,
    private readonly orderStateFactory: OrderStateFactory,
  ) {}

  public injectSocketServer(server: Server): DeliveryOrderCron {
    if (!this.ioServer) this.ioServer = server;
    return this;
  }

  /**
   * change order state from Confirmed => Delivered
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async execute() {
    const orders = await this.orderService.getAllWithConfirmState();
    if (orders.length > 0) {
      let states = orders.map((order) => this.orderStateFactory.buildEntityDeliveredState(order.id));
      states = await this.orderStateService.createMany(states);
      // notify order
      states.forEach((state) => {
        const order = orders.find((order) => order.id === state.order_id);
        if (order) {
          const data = { ...pick(order, ['code']), ...state };
          this.ioServer.to(`${order.user_id}`).emit(WS_EVENTS.DELIVERY_ORDER, data);
        }
      });
    }
  }
}
