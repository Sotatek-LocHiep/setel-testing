import { Injectable } from '@nestjs/common';
import { OrderState } from '../entities/order-state.entity';
import { ORDER_STATUS } from '../constants';

@Injectable()
export class OrderStateFactory {
  buildEntityCreatedState(order_id: number): OrderState {
    return new OrderState(order_id, ORDER_STATUS.CREATED);
  }
  buildEntityConfirmedState(order_id: number): OrderState {
    return new OrderState(order_id, ORDER_STATUS.CONFIRMED);
  }
  buildEntityDeliveredState(order_id: number): OrderState {
    return new OrderState(order_id, ORDER_STATUS.DELIVERED);
  }
  buildEntityCanceledState(order_id: number, reject_reason: string): OrderState {
    return new OrderState(order_id, ORDER_STATUS.CANCELLED, reject_reason);
  }
}
