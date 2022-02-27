import { EntityRepository, Repository } from 'typeorm';
import { OrderState } from '../entities/order-state.entity';

@EntityRepository(OrderState)
export class OrderStateRepository extends Repository<OrderState> {}
