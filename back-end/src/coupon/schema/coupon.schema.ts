import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ collection: 'coupons', timestamps: true })
export class Coupon extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  discountPercentage: number;

  @Prop({ required: true })
  maxUsage: number;

  @Prop({ required: true })
  description: string;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
