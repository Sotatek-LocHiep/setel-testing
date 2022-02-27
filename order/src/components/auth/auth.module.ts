import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from '../user/services/user.service';

@Module({
  imports: [
    ConfigModule,
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
  providers: [JwtStrategy, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
