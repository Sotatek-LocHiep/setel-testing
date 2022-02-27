import { UserService } from '../../user/services/user.service';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { JwtService } from '@nestjs/jwt';
import { pick } from 'lodash';
import { Controller, Post, Body, ConflictException, UnauthorizedException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginParams, RegisterParams } from './auth.dto';
import { authenticatedFields } from '../interfaces/request-authenticated-interface';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private response: ApiResponseService, private jwtService: JwtService, private userService: UserService) {}

  @Post('/register')
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiConflictResponse({ description: 'Username already exist' })
  async register(@Body() data: RegisterParams): Promise<{ [key: string]: any }> {
    const { username, password } = data;
    if (await this.userService.isExisting(username)) {
      throw new ConflictException('Username already exist');
    }
    const user = await this.userService.create({
      ...pick(data, ['username', 'password']),
      ...{
        password: this.userService.hashPassword(password),
      },
    });
    return this.response.primitive({
      token: this.jwtService.sign(pick(user, authenticatedFields)),
    });
  }

  @Post('/login')
  @ApiResponse({ status: 201, description: 'Authenticated' })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async login(@Body() data: LoginParams): Promise<{ [key: string]: any }> {
    const { username, password } = data;
    const user = await this.userService.first({
      where: {
        username,
      },
      select: [...authenticatedFields, 'password'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = this.userService.checkPassword(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Password does not match');
    }
    return this.response.primitive({
      token: this.jwtService.sign(pick(user, authenticatedFields)),
    });
  }
}
