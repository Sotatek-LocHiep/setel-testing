import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../test/test.module';
import { ServicesModule } from '../../../shared/services/services.module';
import { UserService } from '../services/user.service';
import { ProfileController } from './profile.controller';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServicesModule, TestModule],
      providers: [UserService],
      controllers: [ProfileController],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
