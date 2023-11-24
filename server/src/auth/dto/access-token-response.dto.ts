import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponseDto {
  @ApiProperty({
    description: 'accessToken доступа для пользователя',
  })
  accessToken: string;
}
