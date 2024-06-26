import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SizeDocument = Size & Document;

@Schema({ collection: 'sizes', timestamps: true })
export class Size {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true })
  sequence: number;
}

export const SizeSchema = SchemaFactory.createForClass(Size);
