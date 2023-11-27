import { Profile } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto implements Profile {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  avatar: string;
}
