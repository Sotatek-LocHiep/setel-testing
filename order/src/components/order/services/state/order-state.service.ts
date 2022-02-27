import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from '../../../../shared/services/base.service';
import { Repository, Connection } from 'typeorm';
import { OrderStateRepository } from '../../repositories/order-state.repository';
import { OrderState } from '../../entities/order-state.entity';
import { ORDER_STATUS } from '../../constants';
import { OrderStateFactory } from '../../factories/order-state.factory';

@Injectable()
export class OrderStateService extends BaseService {
  public repository: Repository<any>;
  public entity: any = OrderState;

  constructor(private readonly connection: Connection, private readonly orderStateFactory: OrderStateFactory) {
    super();
    this.repository = connection.getCustomRepository(OrderStateRepository);
  }

  async buildEntityCreatedStateValid(order_id: number) {
    const lastState = await this.getLastOrderState(order_id);
    if (lastState) throw new ConflictException('Status order not valid.');
    return this.orderStateFactory.buildEntityCreatedState(order_id);
  }
  async buildEntityConfirmedStateValid(order_id: number) {
    const lastState = await this.getLastOrderState(order_id);
    if (!lastState || lastState.status !== ORDER_STATUS.CREATED) throw new ConflictException('Status order not valid.');
    return this.orderStateFactory.buildEntityConfirmedState(order_id);
  }
  async buildEntityCanceledStateValid(order_id: number) {
    const lastState = await this.getLastOrderState(order_id);
    if (!lastState || (lastState.status !== ORDER_STATUS.CREATED && lastState.status !== ORDER_STATUS.CONFIRMED))
      throw new ConflictException('Status order not valid.');
    return this.orderStateFactory.buildEntityCanceledState(order_id, 'User cancel order.');
  }
  async buildEntityDeliveredStateValid(order_id: number) {
    const lastState = await this.getLastOrderState(order_id);
    if (!lastState || lastState.status !== ORDER_STATUS.CONFIRMED)
      throw new ConflictException('Status order not valid.');
    return this.orderStateFactory.buildEntityDeliveredState(order_id);
  }

  async getLastOrderState(order_id: number) {
    return this.repository.findOne({ where: { order_id }, order: { id: 'DESC' } });
  }

  async getAll(order_id: number) {
    return this.findWhere({ order_id });
  }
}
