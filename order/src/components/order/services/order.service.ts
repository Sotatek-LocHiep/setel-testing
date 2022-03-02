import { ForbiddenException, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { Connection, EntityManager, Repository } from 'typeorm';
import { BaseService } from '../../../shared/services/base.service';
import { ProductService } from '../../product/services/product.service';
import { ORDER_STATUS } from '../constants';
import { CreateOrderParams } from '../controllers/order.dto';
import { Order } from '../entities/order.entity';
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
  ) {
    super();
    this.repository = connection.getCustomRepository(OrderRepository);
  }
  async show(id) {
    return this.repository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.order_states', 'order_states')
      .leftJoinAndSelect('order.order_items', 'order_items')
      .innerJoinAndSelect('order_items.product', 'product')
      .getOne();
  }

  async create(orderParams: CreateOrderServiceParams) {
    return this.connection.transaction(async (entityManager: EntityManager) => {
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
  }

  async checkOwnership(order_id: number, user_id: number): Promise<void> {
    const order = await this.first({ where: { id: order_id, user_id } });
    if (!order) throw new ForbiddenException('Order is not of you.');
  }

  async getAllWithConfirmState(): Promise<Order[]> {
    return this.repository
      .createQueryBuilder('order')
      .innerJoin('order.order_states', 'order_states')
      .groupBy('order.id')
      .having('COUNT(order_states.id) = :count_state', { count_state: 2 })
      .andHaving(
        `
        EXISTS (
          SELECT \`status\` 
          FROM \`order_states\` 
          WHERE \`status\` = :status AND \`order_id\` = \`order\`.\`id\`
          )
      `,
        { status: ORDER_STATUS.CONFIRMED },
      )
      .getMany();
  }
}
