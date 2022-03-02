import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from '../../../shared/services/base.service';
import { Repository, Connection, EntityManager } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
import { OrderProduct } from 'src/components/order/controllers/order.dto';
import { pick, uniqBy } from 'lodash';

export interface OrderProductBuilder {
  product_id: number;
  amount: number;
  price: number;
  sale_price: number;
}

@Injectable()
export class ProductService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Product;

  constructor(private connection: Connection) {
    super();
    this.repository = connection.getCustomRepository(ProductRepository);
  }

  /**
   * To build params to store to order-item
   * @param orderProducts: OrderProduct
   * @returns products Built to store to order-item, products entity loaded minus amount to buy
   */
  async buildOrderItems(orderProducts: OrderProduct[]): Promise<OrderProductBuilder[]> {
    orderProducts = uniqBy(orderProducts, 'product_id');
    const productsBuilt = [];
    for (const orderProduct of orderProducts) {
      const product = await this.findOrFail(orderProduct.product_id);
      productsBuilt.push({
        ...pick(product, ['price', 'sale_price']),
        ...orderProduct,
      });
    }
    return productsBuilt;
  }

  async checkRemainingInTransaction(order_id: number, entityManager: EntityManager) {
    const products = await entityManager
      .createQueryBuilder('products', 'products')
      .innerJoinAndSelect('products.order_items', 'order_items')
      .where('order_items.order_id = :order_id', { order_id })
      .getMany();
    products.forEach((product: Product) => {
      if (product.amount < 0) return false;
    });
    return true;
  }

  async minusAmountInTransaction(order_id: number, entityManager: EntityManager) {
    return entityManager.query(
      `
          UPDATE \`products\`
          INNER JOIN \`order_items\`
          ON \`products\`.\`id\` = \`order_items\`.\`product_id\`
          SET \`products\`.\`amount\` = \`products\`.\`amount\` - \`order_items\`.\`amount\`, \`products\`.\`updated_at\` = CURRENT_TIMESTAMP 
          WHERE \`order_items\`.\`order_id\` = ?
        `,
      [order_id],
    );
  }
  async refundAmountInTransaction(order_id: number, entityManager: EntityManager) {
    return entityManager.query(
      `
            UPDATE \`products\`
            INNER JOIN \`order_items\`
            ON \`products\`.\`id\` = \`order_items\`.\`product_id\`
            SET \`products\`.\`amount\` = \`products\`.\`amount\` + \`order_items\`.\`amount\`, \`products\`.\`updated_at\` = CURRENT_TIMESTAMP 
            WHERE \`order_items\`.\`order_id\` = ?
          `,
      [order_id],
    );
  }
}
