import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Электронная почта пользователя',
    default: 'test@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    default: '123456',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
