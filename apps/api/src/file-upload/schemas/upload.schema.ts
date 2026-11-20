import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Upload {
  @Prop()
  filename: string;

  @Prop()
  originalname: string;

  @Prop()
  size: number;

  @Prop()
  mimeType: string;

  @Prop()
  path: string;
}

export type UploadsDocument = Upload & Document;
export const UploadsSchema = SchemaFactory.createForClass(Upload);
