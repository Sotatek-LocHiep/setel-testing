import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderState } from './order-state.entity';
import { OrderItem } from './order-item.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  note?: string;

  @Column({ type: 'varchar' })
  address: string;

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

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderState, (order_state) => order_state.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order_states: OrderState[];

  @OneToMany(() => OrderItem, (order_item) => order_item.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order_items: OrderItem[];

  @BeforeInsert()
  generateCode() {
    this.code = `#${Date.now()}`;
  }
}
