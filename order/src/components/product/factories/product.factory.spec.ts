import { Product } from '../entities/product.entity';
import { ProductFactory } from './product.factory';

describe('ProductFactory', () => {
  it('should be return instance of Product', () => {
    const data = ProductFactory.buildEntity({
      code: '#P001',
      name: 'Royal Enfield Meteor 350',
      price: 258000,
      sale_price: 237000,
      amount: 10,
    });
    expect(data).toBeInstanceOf(Product);
  });
});
