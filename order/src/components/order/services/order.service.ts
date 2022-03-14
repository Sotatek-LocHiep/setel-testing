import { ForbiddenException, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { FindManyQueryParams } from 'src/shared/validators/find-many-query-params.validator';
import { Connection, EntityManager, Repository } from 'typeorm';
import { BaseService } from '../../../shared/services/base.service';
import { ProductService } from '../../product/services/product.service';
import { ORDER_STATUS } from '../constants';
import { CreateOrderParams } from '../controllers/order.dto';
import { OrderState } from '../entities/order-state.entity';
import { Order } from '../entities/order.entity';
import { OrderStateFactory } from '../factories/order-state.factory';
import { PaymentAdapter } from '../payment-adapter/payment.adapter';
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

  async showPagination({ user_id, query }: { user_id: number; query: FindManyQueryParams }) {
    const params: IPaginationOptions = {
      limit: query.per_page ? query.per_page : 10,
      page: query.page ? query.page : 1,
    };
    let query_builder = this.repository.createQueryBuilder('orders').where('orders.user_id = :user_id', { user_id });
    if (query.search && query.search !== '') {
      query_builder = query_builder.andWhere('code LIKE :keyword', {
        keyword: `%${query.search}%`,
      });
    }
    query_builder = query_builder
      .innerJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.order_states', 'order_states')
      .leftJoinAndSelect('orders.order_items', 'order_items')
      .innerJoinAndSelect('order_items.product', 'product')
      .orderBy('orders.id', 'DESC');
    return this.paginate(query_builder, params);
  }
  async show(id: number) {
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
  /**
   * execute payment order with created state:
   * - Minus amount, check remaining product
   * - Call payment service, get mock payment
   * - Update status payment of orders to Confirmed/Canceled
   */
  async executePayment(order_id: number) {
    return this.connection.transaction(async (entityManager: EntityManager) => {
      await this.productService.minusAmountInTransaction(order_id, entityManager);
      const check = await this.productService.checkRemainingInTransaction(order_id, entityManager);
      let state: OrderState;
      if (!check) {
        state = this.orderStateFactory.buildEntityCanceledState(order_id, `Amount product in order not enough.`);
        await this.productService.refundAmountInTransaction(order_id, entityManager);
      } else {
        const { data } = await this.paymentAdapter.execute(order_id);
        if (data.success) {
          state = this.orderStateFactory.buildEntityConfirmedState(order_id);
        } else {
          state = this.orderStateFactory.buildEntityCanceledState(order_id, data.message);
          await this.productService.refundAmountInTransaction(order_id, entityManager);
        }
      }
      return entityManager.save(state);
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
