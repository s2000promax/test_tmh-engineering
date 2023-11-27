import { RoleEnum, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  isUserBlocked: boolean;

  @ApiProperty()
  isUserConfirmed: boolean;

  @ApiProperty({
    isArray: true,
    enum: RoleEnum,
  })
  roles: RoleEnum[];

  constructor(user: User) {
    Object.assign(this, user);
  }
}
