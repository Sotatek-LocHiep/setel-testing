import { IsString, IsOptional, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class FindManyQueryParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  per_page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  includes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  filters?: { [key: string]: string };
}
