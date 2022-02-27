import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
  Param,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOrderParams } from './order.dto';
import { OrderTransformer } from '../transformers/order.transformer';
import { RequestAuthenticated } from '../../auth/interfaces/request-authenticated-interface';
import { FindManyQueryParams } from '../../../shared/validators/find-many-query-params.validator';
import { IPaginationOptions } from '../../../shared/services/pagination';
import { getCustomRepository } from 'typeorm';
import { OrderRepository } from '../repositories/order.repository';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/order')
export class OrderController {
  constructor(private response: ApiResponseService, private orderService: OrderService) {}

  @Get('/')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async index(
    @Req() request: RequestAuthenticated,
    @Query() query: FindManyQueryParams,
  ): Promise<{ [key: string]: any }> {
    const user_id = request.user.id;
    const params: IPaginationOptions = {
      limit: query.per_page ? query.per_page : 10,
      page: query.page ? query.page : 1,
    };
    let query_builder = getCustomRepository(OrderRepository)
      .createQueryBuilder('orders')
      .where('orders.user_id = :user_id', { user_id });
    if (query.search && query.search !== '') {
      query_builder = query_builder.andWhere('code LIKE :keyword', {
        keyword: `%${query.search}%`,
      });
    }
    query_builder = query_builder
      .innerJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.order_states', 'order_states')
      .leftJoinAndSelect('orders.order_items', 'order_items')
      .innerJoinAndSelect('order_items.product', 'product')
      .orderBy('orders.id', 'DESC');
    const data = await this.orderService.paginate(query_builder, params);
    return this.response.paginate(data, new OrderTransformer(['user', 'order_states', 'order_items']));
  }

  @Get(':id')
  @ApiResponse({ status: 2000, description: 'Success' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Order is not of you.' })
  @ApiNotFoundResponse({ description: 'Order not found.' })
  async show(
    @Req() request: RequestAuthenticated,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ [key: string]: any }> {
    const user_id = request.user.id;
    const order = await this.orderService.show(id);
    if (order.user_id !== user_id) throw new ForbiddenException('Order is not of you.');
    return this.response.item(order, new OrderTransformer(['user', 'order_states', 'order_items']));
  }

  @Post('/')
  @ApiResponse({ status: 201, description: 'Order created' })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiConflictResponse({ description: 'Amount product not enough.' })
  @ApiServiceUnavailableResponse({ description: 'Internal payment service error' })
  async create(@Req() request: RequestAuthenticated, @Body() data: CreateOrderParams): Promise<{ [key: string]: any }> {
    const user_id = request.user.id;
    let order = await this.orderService.create({ ...data, user_id });
    order = await this.orderService.show(order.id);
    return this.response.item(order, new OrderTransformer(['user', 'order_states', 'order_items']));
  }
}
