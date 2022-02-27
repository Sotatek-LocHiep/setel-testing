import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  username?: string;

  @Column({ type: 'varchar' })
  password: string;

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

  @OneToMany(() => Order, (order) => order.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  orders: Order[];
}
