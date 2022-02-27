import { Transformer } from '../../../shared/transformers/transformer';
import { User } from '../entities/user.entity';

export class UserTransformer extends Transformer {
  transform(model: User): any {
    return {
      id: model.id,
      username: model.username,
      created_at: model.created_at,
      updated_at: model.updated_at,
    };
  }
}
