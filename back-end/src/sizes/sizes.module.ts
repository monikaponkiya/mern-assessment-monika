import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Size, SizeSchema } from './schema/size.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Size.name, schema: SizeSchema }]),
  ],
  providers: [],
  controllers: [],
})
export class SizesModule {}
