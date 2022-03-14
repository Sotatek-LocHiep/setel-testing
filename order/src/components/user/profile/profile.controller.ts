import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequestAuthenticated } from '../../auth/interfaces/request-authenticated.interface';
import { UserService } from '../services/user.service';
import { UserTransformer } from '../transformers/user.transformer';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/profile')
export class ProfileController {
  constructor(private response: ApiResponseService, private userService: UserService) {}

  @Get()
  async profile(@Req() request: RequestAuthenticated): Promise<any> {
    const user_id = request.user.id;
    const user = await this.userService.findOrFail(user_id);
    return this.response.item(user, new UserTransformer());
  }
}
