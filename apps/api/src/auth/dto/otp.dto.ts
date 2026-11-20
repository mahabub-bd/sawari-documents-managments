import { ApiProperty } from '@nestjs/swagger';

export class OtpDto {
  @ApiProperty({ example: '+8801712345678', description: 'User phone number' })
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: 'OTP Code', required: false })
  otp?: string;
}
