import { CurrentUser, Public } from '../../libs/decorators';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UserResponseDto, UserProfileDto } from './dto';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CookiesEnum } from '../../config/enums/cookies.enum';
import { JwtPayloadDto, ResponseErrorMessageDto } from '../../config/dto';
import { Response } from 'express';
import { MessageResponseDto } from '../auth/dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary:
      'Получить данные текущего авторизированного пользователя через accessToken ',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: JwtPayloadDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не авторизован',
    type: ResponseErrorMessageDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @Get('me')
  me(@CurrentUser() user: JwtPayloadDto) {
    return user;
  }

  @ApiOperation({
    summary: 'Получить пользователя по ID или электронной почте',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Ответ пользователя',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  async findOneUser(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    return new UserResponseDto(user);
  }

  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Пользователь успешно удален',
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Запрещенное исключение',
    type: ResponseErrorMessageDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не авторизирован',
    type: ResponseErrorMessageDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayloadDto,
    @Res() res: Response,
  ) {
    const deletedUser = await this.userService.delete(id, currentUser);

    if (deletedUser?.id !== id) {
      throw new BadRequestException('Не удалось удалить пользователя');
    }

    res.sendStatus(HttpStatus.OK);
  }

  @ApiOperation({ summary: 'Обновление профиля текущего пользователя' })
  @ApiBody({
    type: UserProfileDto,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Профиль пользователя был успешно обновлен',
    type: MessageResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не авторизирован',
    type: ResponseErrorMessageDto,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Запрещено',
    type: ResponseErrorMessageDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  async updateUserProfile(
    @Body() body: UserProfileDto,
    @CurrentUser() currentUser: JwtPayloadDto,
    @Res() res: Response,
  ) {
    const userProfile = await this.userService.updateProfile(body, currentUser);

    if (!userProfile) {
      throw new BadRequestException('Не удалось обновить профиль пользователя');
    }

    res.sendStatus(HttpStatus.OK);
  }
}
