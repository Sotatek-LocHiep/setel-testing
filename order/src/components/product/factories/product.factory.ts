import { Product } from '../entities/product.entity';

export class ProductFactory {
  static buildEntity(params: {
    code: string;
    name: string;
    price: number;
    sale_price: number;
    amount: number;
  }): Product {
    const { code, name, price, sale_price, amount } = params;
    return new Product(code, name, price, sale_price, amount);
  }
}
