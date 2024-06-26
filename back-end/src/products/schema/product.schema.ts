import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productDescription: string;

  @Prop({ required: true })
  productImage: string;

  @Prop({ required: true })
  productRate: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
