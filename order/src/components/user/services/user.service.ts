import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { BaseService } from '../../../shared/services/base.service';
import { UserRepository } from '../repositories/user.repository';
import { Repository, Connection } from 'typeorm';
import { HashService } from '../../../shared/services/hash/hash.service';

@Injectable()
export class UserService extends BaseService {
  public repository: Repository<any>;
  public entity: any = User;

  constructor(private connection: Connection, private hashService: HashService) {
    super();
    this.repository = connection.getCustomRepository(UserRepository);
  }

  async isExisting(username: string): Promise<boolean> {
    const is_existing = (await this.repository.count({ where: { username } })) > 0;
    return is_existing;
  }

  hashPassword(password: string): string {
    return this.hashService.hash(password);
  }

  checkPassword(password: string, hashed: string): boolean {
    return this.hashService.check(password, hashed);
  }
}
