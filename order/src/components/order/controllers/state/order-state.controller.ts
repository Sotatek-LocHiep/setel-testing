import { ApiResponseService } from '../../../../shared/services/api-response/api-response.service';
import { Controller, Req, UseGuards, Put, Get, Param, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OrderService } from '../../services/order.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RequestAuthenticated } from 'src/components/auth/interfaces/request-authenticated-interface';
import { OrderStateTransformer } from '../../transformers/order-state.transformer';
import { OrderStateService } from '../../services/state/order-state.service';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/order-state')
export class OrderStateController {
  constructor(
    private response: ApiResponseService,
    private orderService: OrderService,
    private readonly orderStateService: OrderStateService,
  ) {}

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Order is not of you.' })
  @ApiConflictResponse({ description: 'Status order not valid.' })
  async show(
    @Req() request: RequestAuthenticated,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ [key: string]: any }> {
    const user_id = request.user.id;
    await this.orderService.checkOwnership(id, user_id);
    const states = await this.orderStateService.getAll(id);
    return this.response.collection(states, new OrderStateTransformer());
  }

  @Get(':id/current')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Order is not of you.' })
  @ApiConflictResponse({ description: 'Order not found.' })
  async current(
    @Req() request: RequestAuthenticated,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ [key: string]: any }> {
    const user_id = request.user.id;
    await this.orderService.checkOwnership(id, user_id);
    const state = await this.orderStateService.getLastOrderState(id);
    return this.response.item(state, new OrderStateTransformer());
  }

  @Put(':id/confirm')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Order is not of you.' })
  @ApiConflictResponse({ description: 'Status order not valid.' })
  async confirm(
    @Req() request: RequestAuthenticated,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ [key: string]: any }> {
    const user_id = request.user.id;
    await this.orderService.checkOwnership(id, user_id);
    const state = await this.orderStateService.create(await this.orderStateService.buildEntityConfirmedStateValid(id));
    return this.response.item(state, new OrderStateTransformer());
  }

  @Put(':id/cancel')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Order is not of you.' })
  @ApiConflictResponse({ description: 'Status order not valid.' })
  async cancel(
    @Req() request: RequestAuthenticated,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ [key: string]: any }> {
    const user_id = request.user.id;
    await this.orderService.checkOwnership(id, user_id);
    const state = await this.orderStateService.create(await this.orderStateService.buildEntityCanceledStateValid(id));
    return this.response.item(state, new OrderStateTransformer());
  }
}
