import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../test/test.module';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { HashService } from '../../../shared/services/hash/hash.service';
import { UserService } from '../../user/services/user.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthController } from './auth.controller';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('APP_KEY'),
            signOptions: {
              expiresIn: configService.get('JWT_TTL'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [ApiResponseService, HashService, JwtStrategy, UserService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
