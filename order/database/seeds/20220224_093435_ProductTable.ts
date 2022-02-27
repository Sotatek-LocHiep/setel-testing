import { Connection } from 'typeorm';
import { ProductFactory } from '../../src/components/product/factories/product.factory';

export default class ProductTable {
  async up(connection: Connection): Promise<any> {
    const items = [
      { code: '#P001', name: 'Royal Enfield Meteor 350', price: 258000, sale_price: 237000, amount: 10 },
      { code: '#P002', name: 'CFMOTO 700 CL-X Heritage', price: 369800, sale_price: null, amount: 4 },
      { code: '#P003', name: 'Keeway Cafe Racer 152', price: 169000, sale_price: null, amount: 0 },
      { code: '#P004', name: 'Indian Scout Bobber Sixty', price: 43900, sale_price: 42900, amount: 8 },
      { code: '#P005', name: 'Yamaha WR 155', price: 44800, sale_price: null, amount: 3 },
      { code: '#P006', name: 'Indian Chieftain', price: 47800, sale_price: 47200, amount: 2 },
      { code: '#P007', name: 'TVS XL100', price: 47800, sale_price: null, amount: 5 },
      { code: '#P008', name: 'Skygo Archer 110', price: 38500, sale_price: 36200, amount: 10 },
      { code: '#P009', name: 'Motorstar Star-X 125S', price: 39000, sale_price: null, amount: 4 },
      { code: '#P010', name: 'Motorstar Viber', price: 39100, sale_price: null, amount: 8 },
      { code: '#P011', name: 'Skygo Prince 125', price: 39000, sale_price: 38700, amount: 12 },
      { code: '#P012', name: 'TVS Neo XR 125', price: 39900, sale_price: null, amount: 20 },
    ];
    const entities = items.map((params) => ProductFactory.buildEntity(params));
    await connection.manager.save(entities);
  }
}
