import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../test/test.module';
import { HashService } from '../../../shared/services/hash/hash.service';
import { UserService } from './user.service';
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [HashService, UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be return hashed password', () => {
    const password = '123456';
    const hashed = service.hashPassword(password);
    expect(typeof hashed).toBe('string');
  });
  it('should be return toBeTruthy check password', () => {
    const password = '123456';
    const hashed = '$2b$10$mgDeU8tryXtXwQJOlNs50OeqTMl6qjBlcbdhhhcEWcbNlqxf5dlF.';
    expect(service.checkPassword(password, hashed)).toBeTruthy();
  });
});
