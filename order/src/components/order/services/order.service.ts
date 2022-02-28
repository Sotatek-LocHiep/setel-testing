import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { Connection, EntityManager, Repository } from 'typeorm';
import { BaseService } from '../../../shared/services/base.service';
import { ProductService } from '../../product/services/product.service';
import { PaymentAdapter } from '../adapters/payment/payment.adapter';
import { CreateOrderParams } from '../controllers/order.dto';
import { OrderState } from '../entities/order-state.entity';
import { Order } from '../entities/order.entity';
import { OrderStateFactory } from '../factories/order-state.factory';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemService } from './item/order-item.service';
import { OrderStateService } from './state/order-state.service';
interface CreateOrderServiceParams extends CreateOrderParams {
  user_id: number;
}

@Injectable()
export class OrderService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Order;

  constructor(
    private readonly connection: Connection,
    private readonly orderItemService: OrderItemService,
    private readonly orderStateService: OrderStateService,
    private readonly productService: ProductService,
    private readonly paymentAdapter: PaymentAdapter,
    private readonly orderStateFactory: OrderStateFactory,
  ) {
    super();
    this.repository = connection.getCustomRepository(OrderRepository);
  }
  async show(id) {
    const order = await this.repository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.order_states', 'order_states')
      .leftJoinAndSelect('order.order_items', 'order_items')
      .innerJoinAndSelect('order_items.product', 'product')
      .getOne();
    return order;
  }

  async create(orderParams: CreateOrderServiceParams) {
    const data = await this.connection.transaction(async (entityManager: EntityManager) => {
      // store order
      let order: any = entityManager.create(this.entity, omit(orderParams, ['products']));
      order = await entityManager.save(order);
      // store order items
      const builtItems = await this.productService.buildOrderItems(orderParams.products);
      await entityManager.save(
        this.orderItemService.entity,
        builtItems.map((orderItem) => ({ ...orderItem, order_id: order.id })),
      );
      // store order state
      const orderState = await this.orderStateService.buildEntityCreatedStateValid(order.id);
      await entityManager.save(orderState);
      return order;
    });
    return data;
  }

  async confirmAndPay(order_id: number) {
    const state = await this.connection.transaction(async (entityManager: EntityManager) => {
      // update amount product
      await entityManager.query(
        `
        UPDATE \`products\`
        INNER JOIN \`order_items\`
        ON \`products\`.\`id\` = \`order_items\`.\`product_id\`
        SET \`products\`.\`amount\` = \`products\`.\`amount\` - \`order_items\`.\`amount\`, \`products\`.\`updated_at\` = CURRENT_TIMESTAMP 
        WHERE \`order_items\`.\`order_id\` = ?
      `,
        [order_id],
      );
      //check remaining
      await this.productService.checkAmountTransaction(order_id, entityManager);
      // store valid order confirm state
      await entityManager.save(await this.orderStateService.buildEntityConfirmedStateValid(order_id));
      // call payment service
      const { data } = await this.paymentAdapter.execute(order_id);
      // create final order state
      let orderState: OrderState;
      if (data.success) {
        orderState = this.orderStateFactory.buildEntityDeliveredState(order_id);
      } else {
        orderState = this.orderStateFactory.buildEntityCanceledState(order_id, data.message);
      }
      // store final order state
      await entityManager.save(orderState);
      return orderState;
    });
    return state;
  }

  async checkOwnership(order_id: number, user_id: number): Promise<boolean> {
    const order = await this.first({ where: { id: order_id, user_id } });
    return order ? true : false;
  }
}
