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
    const states = orders.map((order) => this.orderStateFactory.buildEntityDeliveredState(order.id));
    await this.orderStateService.createMany(states);
    // notify delivery state
    orders.forEach((order) =>
      this.ioServer.to(`${order.user_id}`).emit(WS_EVENTS.DELIVERY_ORDER, {
        ...pick(order, ['code']),
        ...this.orderStateFactory.buildEntityDeliveredState(order.id),
      }),
    );
  }
}
