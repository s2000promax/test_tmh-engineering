import { RoleEnum, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @Exclude()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  isUserBlocked: boolean;

  @ApiProperty()
  isUserConfirmed: boolean;

  @ApiProperty()
  isUserEmailConfirmed: boolean;

  @ApiProperty()
  isUserPhoneConfirmed: boolean;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    isArray: true,
    enum: RoleEnum,
  })
  roles: RoleEnum[];

  constructor(user: User) {
    Object.assign(this, user);
  }
}
