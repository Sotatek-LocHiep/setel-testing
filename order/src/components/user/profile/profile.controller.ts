import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { UserService } from '../services/user.service';
import { UserTransformer } from '../transformers/user.transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { HashService } from '../../../shared/services/hash/hash.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestAuthenticated } from '../../auth/interfaces/request-authenticated-interface';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/profile')
export class ProfileController {
  constructor(
    private response: ApiResponseService,
    private userService: UserService,
    private hashService: HashService,
  ) {}

  @Get()
  async profile(@Req() request: RequestAuthenticated): Promise<any> {
    const user_id = request.user.id;
    const user = await this.userService.findOrFail(user_id);
    return this.response.item(user, new UserTransformer());
  }
}
