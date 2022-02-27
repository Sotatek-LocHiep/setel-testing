/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Transformer } from '../../../shared/transformers/transformer';
import { OrderItem } from '../entities/order-item.entity';
import { OrderState } from '../entities/order-state.entity';
import { Order } from '../entities/order.entity';
import { OrderItemTransformer } from './order-item.transformer';
import { OrderStateTransformer } from './order-state.transformer';
import { User } from '../../user/entities/user.entity';
import { UserTransformer } from '../../user/transformers/user.transformer';

export interface OrderInterface {
  id: number;
  code: string;
  note?: string;
  address: string;
  created_at: Date;
  user: User;
  order_items: OrderItem[];
  order_states: OrderState[];
}

export class OrderTransformer extends Transformer {
  transform(model: Order) {
    return {
      id: model.id,
      code: model.code,
      note: model.note,
      address: model.address,
      created_at: model.created_at,
    };
  }
  includeOrderItems(model: OrderInterface): any {
    return this.collection(model.order_items, new OrderItemTransformer(['product']));
  }
  includeOrderStates(model: OrderInterface): any {
    return this.collection(model.order_states, new OrderStateTransformer());
  }
  includeUser(model: OrderInterface): any {
    return this.item(model.user, new UserTransformer());
  }
}
