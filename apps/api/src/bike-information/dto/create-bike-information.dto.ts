import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BikeRegistrationStatus } from 'src/common/enums/bikeregistration.enum';

export class CreateBikeInformationDto {
  @ApiProperty({ description: 'Name of the bike owner' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Phone number of the bike owner' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'National ID number of the bike owner' })
  @IsNumber()
  @IsNotEmpty()
  nid: number;

  @ApiProperty({ description: 'Address of the bike owner' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Brand of the bike' })
  @IsString()
  @IsNotEmpty()
  bikeBrand: string;

  @ApiProperty({ description: 'Model of the bike' })
  @IsString()
  @IsNotEmpty()
  bikeModel: string;

  @ApiProperty({ description: 'Engine number of the bike' })
  @IsString()
  @IsNotEmpty()
  engineNumber: string;

  @ApiProperty({ description: 'Chassis number of the bike' })
  @IsString()
  @IsNotEmpty()
  chassisNumber: string;

  @ApiProperty({ description: 'Manufacturing year of the bike', example: 2022 })
  @IsNumber()
  @IsNotEmpty()
  manufacturingYear: number;

  @ApiProperty({
    description: 'Registration status of the bike',
    enum: BikeRegistrationStatus,
  })
  @IsEnum(BikeRegistrationStatus)
  @IsNotEmpty()
  registrationStatus: BikeRegistrationStatus;

  @ApiProperty({
    description: 'Registration number of the bike (required if registered)',
    required: false,
  })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiProperty({ description: 'Odometer reading of the bike' })
  @IsNumber()
  @IsNotEmpty()
  odo: number;

  @ApiProperty({ description: 'Name of the witness' })
  @IsString()
  @IsNotEmpty()
  witnessName: string;

  @ApiProperty({ description: 'Phone number of the witness' })
  @IsString()
  @IsNotEmpty()
  witnessPhoneNumber: string;

  @ApiProperty({ description: 'NID of the witness' })
  @IsNumber()
  @IsNotEmpty()
  witnessNID: number;

  @ApiProperty({ description: 'Purchase amount' })
  @IsNumber()
  @IsNotEmpty()
  purchaseAmount: number;

  @ApiProperty({ description: 'Security amount' })
  @IsNumber()
  @IsNotEmpty()
  securityAmount: number;

  @ApiProperty({
    description: 'Whether security money has been returned',
    default: false,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  securityMoneyReturned = false;

  @ApiProperty({ description: 'Key status' })
  @IsNumber()
  @IsNotEmpty()
  keyStatus: number;

  @ApiProperty({ description: 'Remarks', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({
    description: 'ID of the uploaded registration document (optional)',
    required: false,
  })
  @IsOptional()
  regDocumentId?: string;

  @ApiProperty({
    description: 'ID of the uploaded current photo of the bike (optional)',
    required: false,
  })
  @IsOptional()
  currentPhotoId?: string;

  @ApiProperty({
    description: 'ID of the uploaded selling video of the bike (optional)',
    required: false,
  })
  @IsOptional()
  sellingVideoId?: string;

  @ApiProperty({
    description: 'ID of the uploaded witness NID photo (optional)',
    required: false,
  })
  @IsOptional()
  witnessNIDPhotoId?: string;

  @ApiProperty({
    description: 'ID of the uploaded seller NID photo (optional)',
    required: false,
  })
  @IsOptional()
  sellerNIDPhotoId?: string;

  @ApiProperty({
    description: 'ID of the uploaded seller DL photo (optional)',
    required: false,
  })
  @IsOptional()
  sellerDLPhotoId?: string;

  @ApiProperty({
    description: 'ID of the user who last updated this record (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  updateById?: string;
}
