import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductEntriesService } from './product-entries.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import {
  PRODUCT_DETAILS,
  PRODUCT_LIST,
} from 'src/common/constants/response.constants';
import { statusOk } from 'src/common/constants/response.status.constant';

@Controller('product-entries')
@ApiTags('Product Management')
export class ProductEntriesController {
  constructor(private productEntriesService: ProductEntriesService) {}

  @Post('product-list')
  @ApiOperation({
    summary: 'Product list api',
  })
  @ResponseMessage(PRODUCT_LIST)
  @HttpCode(statusOk)
  async getStudentList() {
    return await this.productEntriesService.findAllProduct();
  }

  @Get('product-detail/:productId')
  @ApiOperation({
    summary: 'Get product details api',
  })
  @ResponseMessage(PRODUCT_DETAILS)
  async getProductDetails(@Param('productId') productId: string) {
    return await this.productEntriesService.getProductDetails(productId);
  }
}
