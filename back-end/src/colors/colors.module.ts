import { Module } from '@nestjs/common';
import { Color, ColorSchema } from './schema/color.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Color.name, schema: ColorSchema }]),
  ],
  providers: [],
  controllers: [],
})
export class ColorsModule {}
