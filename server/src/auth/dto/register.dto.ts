import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class RegisterDto implements Partial<User> {
  @ApiProperty({
    description: 'Электронная почта пользователя',
    default: 'test@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя. Минимальная длина 6 символов',
    default: '123456',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
