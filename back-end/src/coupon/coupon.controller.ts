import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CouponAppliedDto } from 'src/order/dto/coupon-applied.dto';
import { CouponService } from './coupon.service';

@Controller('coupon')
@ApiTags('Coupon Management')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Get('coupon-list')
  @ApiOperation({
    summary: 'Get coupon list api',
  })
  async getCouponList() {
    return this.couponService.getCouponList();
  }

  @Post('check-applied-coupon')
  @ApiOperation({
    summary: 'Check applied coupon api',
  })
  async checkAppliedCode(@Body() body: CouponAppliedDto) {
    return await this.couponService.checkAppliedCode(body);
  }
}
