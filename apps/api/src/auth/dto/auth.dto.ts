import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class AuthDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'password123',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Role assigned to the user (e.g., Admin, User)',
    enum: Role,
    example: Role.User,
    required: false,
  })
  role?: Role;
}
