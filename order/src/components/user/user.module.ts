import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfileModule, ConfigModule],
  controllers: [],
  providers: [UserService],
})
export class UserModule {}
