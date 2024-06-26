import { Module } from '@nestjs/common';
import { DatabaseModule } from './provider/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { SizesModule } from './sizes/sizes.module';
import { ColorsModule } from './colors/colors.module';
import { ProductEntriesModule } from './product-entries/product-entries.module';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import AppConfiguration from './config/app.config';
import DatabaseConfiguration from './config/database.config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration, DatabaseConfiguration, authConfig],
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    DatabaseModule,
    ProductsModule,
    SizesModule,
    ColorsModule,
    ProductEntriesModule,
    CouponModule,
    OrderModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
