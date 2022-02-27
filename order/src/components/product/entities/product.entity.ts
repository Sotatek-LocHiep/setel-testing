import { OrderItem } from '../../order/entities/order-item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  constructor(code: string, name: string, price: number, sale_price: number, amount: number) {
    this.code = code;
    this.name = name;
    this.price = price;
    this.sale_price = sale_price;
    this.amount = amount;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  name: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ type: 'float', nullable: true })
  sale_price!: number;

  @Column({
    type: 'int',
  })
  amount: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  public updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deleted_at: Date;

  @OneToMany(() => OrderItem, (order_item) => order_item.product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order_items: OrderItem[];
}
