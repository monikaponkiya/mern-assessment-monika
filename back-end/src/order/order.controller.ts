import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ORDER_DETAILS } from 'src/common/constants/response.constants';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
@ApiTags('Order Management')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Post('create-order')
  @ApiOperation({
    summary: 'Create order api',
  })
  async createOrder(@Body() body: CreateOrderDto) {
    return await this.ordersService.createOrder(body);
  }

  @Get('order-detail/:orderId')
  @ApiOperation({
    summary: 'Get product details api',
  })
  @ResponseMessage(ORDER_DETAILS)
  async getProductDetails(@Param('orderId') orderId: string) {
    return await this.ordersService.getOrderDetails(orderId);
  }
}
