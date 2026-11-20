import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Upload } from 'src/file-upload/schemas/upload.schema';
import { User } from 'src/users/schemas/user.schema'; // Assuming you have a User schema

@Schema({ timestamps: true })
export class BikeInformation {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  nid: number;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  bikeBrand: string;

  @Prop({ required: true })
  bikeModel: string;

  @Prop({ required: true })
  engineNumber: string;

  @Prop({ required: true })
  chassisNumber: string;

  @Prop({ required: true })
  manufacturingYear: number;

  @Prop({
    enum: ['OnTest', 'Registered'],
    required: true,
  })
  registrationStatus: 'OnTest' | 'Registered';

  @Prop()
  registrationNumber: string; // Only required if registrationStatus is 'Registered'

  @Prop({ required: true })
  odo: number;

  @Prop({ required: true })
  witnessName: string;

  @Prop({ required: true })
  witnessPhoneNumber: string;

  @Prop({ required: true })
  witnessNID: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Upload', default: null })
  witnessNIDPhoto?: Upload;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Upload', default: null })
  sellerNIDPhoto?: Upload;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Upload', default: null })
  sellerDLPhoto?: Upload;

  @Prop({
    enum: [1, 2], // Assuming 1 and 2 represent different key statuses
    required: true,
  })
  keyStatus: number;

  @Prop({ required: true })
  purchaseAmount: number;

  @Prop({ required: true })
  securityAmount: number;

  @Prop({ default: false, required: true })
  securityMoneyReturned: boolean;

  @Prop()
  remarks: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Upload', default: null })
  regDocument?: Upload; // Assuming you have an Upload schema for file uploads

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Upload', default: null })
  currentPhoto?: Upload;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Upload', default: null })
  sellingVideo?: Upload;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updateBy?: User;
}

export type BikeInformationDocument = BikeInformation & Document;
export const BikeInformationSchema =
  SchemaFactory.createForClass(BikeInformation);
