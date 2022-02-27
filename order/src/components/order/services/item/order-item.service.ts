import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../../shared/services/base.service';
import { Repository, Connection } from 'typeorm';
import { OrderItemRepository } from '../../repositories/order-item.repository';
import { OrderItem } from '../../entities/order-item.entity';

@Injectable()
export class OrderItemService extends BaseService {
  public repository: Repository<any>;
  public entity: any = OrderItem;

  constructor(private connection: Connection) {
    super();
    this.repository = connection.getCustomRepository(OrderItemRepository);
  }
}
