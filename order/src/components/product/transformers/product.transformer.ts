/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Transformer } from '../../../shared/transformers/transformer';
import { Product } from '../entities/product.entity';

export interface ProductInterface {
  id: number;
  code: string;
  name: string;
  amount: number;
  price: number;
  sale_price: number;
  created_at: Date;
}

export class ProductTransformer extends Transformer {
  transform(model: Product): ProductInterface {
    return {
      id: model.id,
      code: model.code,
      name: model.name,
      amount: model.amount,
      price: model.price,
      sale_price: model.sale_price,
      created_at: model.created_at,
    };
  }
}
