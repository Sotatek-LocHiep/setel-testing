/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Transformer } from '../../../shared/transformers/transformer';
import { OrderItem } from '../entities/order-item.entity';
import { ProductTransformer } from '../../product/transformers/product.transformer';
import { Product } from '../../product/entities/product.entity';

export interface OrderItemInterface {
  id: number;
  amount: number;
  price: number;
  sale_price: number;
  product: Product;
}

export class OrderItemTransformer extends Transformer {
  transform(model: OrderItem) {
    return {
      id: model.id,
      amount: model.amount,
      price: model.price,
      sale_price: model.sale_price,
    };
  }

  includeProduct(model: OrderItemInterface): any {
    return this.item(model.product, new ProductTransformer());
  }
}
