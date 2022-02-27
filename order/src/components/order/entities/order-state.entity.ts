import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_states' })
export class OrderState {
  constructor(order_id: number, status: number, reject_reason: string = null) {
    this.order_id = order_id;
    this.status = status;
    this.reject_reason = reject_reason;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column()
  status: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  reject_reason!: string;

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

  @ManyToOne(() => Order, (order) => order.order_states)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
