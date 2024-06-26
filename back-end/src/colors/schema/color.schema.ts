import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ColorDocument = Color & Document;

@Schema({ collection: 'colors', timestamps: true })
export class Color {
  @Prop({ required: true, default: '' })
  name: string;
}

export const ColorSchema = SchemaFactory.createForClass(Color);
