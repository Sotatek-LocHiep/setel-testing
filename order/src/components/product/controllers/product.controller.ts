import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPaginationOptions } from '../../../shared/services/pagination';
import { FindManyQueryParams } from '../../../shared/validators/find-many-query-params.validator';
import { getCustomRepository } from 'typeorm';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { ProductRepository } from '../repositories/product.repository';
import { ProductService } from '../services/product.service';
import { ProductTransformer } from '../transformers/product.transformer';

@ApiTags('Product')
@Controller('api/v1/product')
export class ProductController {
  constructor(private response: ApiResponseService, private productService: ProductService) {}

  @Get('/')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiBadRequestResponse()
  async index(@Query() query: FindManyQueryParams): Promise<{ [key: string]: any }> {
    const params: IPaginationOptions = {
      limit: query.per_page ? query.per_page : 10,
      page: query.page ? query.page : 1,
    };
    let query_builder = getCustomRepository(ProductRepository).createQueryBuilder('products');
    if (query.search && query.search !== '') {
      query_builder = query_builder
        .andWhere('name LIKE :keyword', {
          keyword: `%${query.search}%`,
        })
        .orWhere('code LIKE :keyword', {
          keyword: `%${query.search}%`,
        });
    }
    const data = await this.productService.paginate(query_builder, params);
    return this.response.paginate(data, new ProductTransformer());
  }
}
