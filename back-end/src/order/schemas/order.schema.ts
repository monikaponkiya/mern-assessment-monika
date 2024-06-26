import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ collection: 'orders', timestamps: true })
export class Order extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'productEntries' })
  productEntryId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop()
  orderValue: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'coupons',
    default: null,
    required: false,
  })
  couponId?: mongoose.Schema.Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
