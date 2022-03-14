import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { FindManyQueryParams } from '../../../shared/validators/find-many-query-params.validator';
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
    const products = await this.productService.showPagination(query);
    return this.response.paginate(products, new ProductTransformer());
  }
}
