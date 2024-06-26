import { Module, OnModuleInit } from '@nestjs/common';
import { ProductEntriesService } from './product-entries.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductEntries,
  ProductEntriesSchema,
} from './schema/product-entries.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { Size, SizeSchema } from 'src/sizes/schema/size.schema';
import { Color, ColorSchema } from 'src/colors/schema/color.schema';
import { Coupon, CouponSchema } from 'src/coupon/schema/coupon.schema';
import { ProductEntriesController } from './product-entries.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductEntries.name, schema: ProductEntriesSchema },
    ]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Size.name, schema: SizeSchema }]),
    MongooseModule.forFeature([{ name: Color.name, schema: ColorSchema }]),
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
  ],
  providers: [ProductEntriesService],
  controllers: [ProductEntriesController],
})
export class ProductEntriesModule implements OnModuleInit {
  constructor(private readonly productEntriesService: ProductEntriesService) {}
  async onModuleInit(): Promise<void> {
    await this.productEntriesService.createInitialProductEntries();
  }
}
