import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProductEntriesDocument = ProductEntries & Document;

@Schema({ collection: 'productEntries', timestamps: true })
export class ProductEntries {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  productId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  sizeId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  colorId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, default: null })
  price: number;
}

export const ProductEntriesSchema =
  SchemaFactory.createForClass(ProductEntries);
