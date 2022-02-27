import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginParams {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;
}

export class RegisterParams {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;
}
