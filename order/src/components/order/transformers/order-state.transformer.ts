/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Transformer } from '../../../shared/transformers/transformer';
import { OrderState } from '../entities/order-state.entity';

export class OrderStateTransformer extends Transformer {
  transform(model: OrderState) {
    return {
      id: model.id,
      status: model.status,
      reject_reason: model.reject_reason || undefined,
      created_at: model.created_at,
    };
  }
}
