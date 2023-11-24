import { RoleEnum, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class JwtPayloadDto implements Partial<User> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({
    isArray: true,
    enum: RoleEnum,
  })
  roles: RoleEnum[];
}
