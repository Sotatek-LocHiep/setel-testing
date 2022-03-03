import { Injectable } from '@nestjs/common';
import { pick, uniqBy } from 'lodash';
import { OrderProduct } from 'src/components/order/controllers/order.dto';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { FindManyQueryParams } from 'src/shared/validators/find-many-query-params.validator';
import { Connection, EntityManager, Repository } from 'typeorm';
import { BaseService } from '../../../shared/services/base.service';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';

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
  async showPagination(query: FindManyQueryParams) {
    const params: IPaginationOptions = {
      limit: query.per_page ? query.per_page : 10,
      page: query.page ? query.page : 1,
    };
    let query_builder = this.repository.createQueryBuilder('products');
    if (query.search && query.search !== '') {
      query_builder = query_builder
        .andWhere('name LIKE :keyword', {
          keyword: `%${query.search}%`,
        })
        .orWhere('code LIKE :keyword', {
          keyword: `%${query.search}%`,
        });
    }
    return this.paginate(query_builder, params);
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
