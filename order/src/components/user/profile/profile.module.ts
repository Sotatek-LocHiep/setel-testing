import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UserService } from '../services/user.service';
@Module({
  controllers: [ProfileController],
  imports: [],
  providers: [UserService],
})
export class ProfileModule {}
