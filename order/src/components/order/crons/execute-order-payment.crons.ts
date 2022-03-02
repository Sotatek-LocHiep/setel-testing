import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductService } from '../../product/services/product.service';
import { Connection, EntityManager } from 'typeorm';
import { PaymentAdapter } from '../adapters/payment/payment.adapter';
import { OrderStateFactory } from '../factories/order-state.factory';
import { OrderService } from '../services/order.service';
import { OrderStateService } from '../services/state/order-state.service';
import { OrderState } from '../entities/order-state.entity';

@Injectable()
export class ExecuteOrderPaymentCron {
  constructor(
    private readonly connection: Connection,
    private readonly orderService: OrderService,
    private readonly paymentAdapter: PaymentAdapter,
    private readonly orderStateFactory: OrderStateFactory,
    private readonly orderStateService: OrderStateService,
    private readonly productService: ProductService,
  ) {}

  /**
   * execute payment order with confirmed state:
   * - Get all order with confirmed state from DB
   * - Minus amount, check remaining product
   * - Call payment service, get mock payment
   * - Update status payment of orders
   * ==> Another way, we can use Queue Job is better, but I don't want to use more distributed for this application
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async execute() {
    const orders = await this.orderService.getAllWithConfirmState();
    for (const order of orders) {
      await this.connection.transaction(async (entityManager: EntityManager) => {
        await this.productService.minusAmountInTransaction(order.id, entityManager);
        const check = await this.productService.checkRemainingInTransaction(order.id, entityManager);
        if (!check) {
          await entityManager.save(
            this.orderStateFactory.buildEntityCanceledState(
              order.id,
              `Amount product in order: ${order.code} not enough.`,
            ),
          );
          await this.productService.refundAmountInTransaction(order.id, entityManager);
        } else {
          const { data } = await this.paymentAdapter.execute(order.id);
          let state: OrderState;
          if (data.success) {
            state = this.orderStateFactory.buildEntityDeliveredState(order.id);
          } else {
            state = this.orderStateFactory.buildEntityCanceledState(order.id, data.message);
            await this.productService.refundAmountInTransaction(order.id, entityManager);
          }
          await entityManager.save(state);
        }
      });
    }
  }
}
