import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { OrderItem } from '../order-item.entity';

@EventSubscriber()
export class OrderItemSubscriber implements EntitySubscriberInterface<OrderItem> {
  listenTo() {
    return OrderItem;
  }
  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<OrderItem>) {
    console.log(`BEFORE OrderItem INSERTED: `, event.entity);
  }
}
