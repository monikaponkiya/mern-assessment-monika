import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schema/coupon.schema';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';
import {
  ProductEntries,
  ProductEntriesSchema,
} from 'src/product-entries/schema/product-entries.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: ProductEntries.name, schema: ProductEntriesSchema },
    ]),
  ],
  providers: [CouponService],
  controllers: [CouponController],
})
export class CouponModule {}
