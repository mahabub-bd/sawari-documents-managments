import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserActivity {
  @Prop({ required: true })
  action: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: false })
  path?: string;
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);
export type UserActivityDocument = UserActivity & Document;
