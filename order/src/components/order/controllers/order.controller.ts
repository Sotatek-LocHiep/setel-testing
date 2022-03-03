import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { FindManyQueryParams } from '../../../shared/validators/find-many-query-params.validator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequestAuthenticated } from '../../auth/interfaces/request-authenticated-interface';
import { OrderService } from '../services/order.service';
import { OrderTransformer } from '../transformers/order.transformer';
import { CreateOrderParams } from './order.dto';

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
    const orders = await this.orderService.showPagination({ user_id, query });
    return this.response.paginate(orders, new OrderTransformer(['user', 'order_states', 'order_items']));
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
    await this.orderService.checkOwnership(id, user_id);
    const order = await this.orderService.show(id);
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
