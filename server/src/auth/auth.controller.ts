import { Public } from '../../libs/decorators';
import { Cookie, UserAgent } from './decorators';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  AccessTokenResponseDto,
  LoginDto,
  MessageResponseDto,
  RegisterDto,
} from './dto';
import { ITokens } from './types/auth.interface';
import { CookiesEnum } from '../../config/enums/cookies.enum';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseErrorMessageDto } from '../../config/dto';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Пользователь успешно зарегистрирован',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
    type: ResponseErrorMessageDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const user = await this.authService.register(dto);

    if (!user) {
      throw new BadRequestException('Не удалось зарегистрировать пользователя');
    }

    res
      .status(HttpStatus.CREATED)
      .json({ message: 'Пользователь успешно зарегистрирован' });
  }

  @ApiOperation({ summary: 'Вход в систему' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Токены успешно сгенерированы',
    type: AccessTokenResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не авторизован',
    type: ResponseErrorMessageDto,
  })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const tokens = await this.authService.login(dto, agent);

    if (!tokens) {
      throw new BadRequestException('Не удалось войти в систему');
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  @ApiOperation({ summary: 'Выход пользователя из системы' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Пользователь успешно вышел из системы',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @Get('logout')
  async logout(
    @Cookie(CookiesEnum.REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      res.status(HttpStatus.OK).json({ message: 'Пользователь успешно вышел из системы' });
      return;
    }

    await this.authService.deleteRefreshToken(refreshToken).catch(() => {
      throw new BadRequestException('Не удалось удалить refresh-токен');
    });

    res.cookie(CookiesEnum.REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });

    res.status(HttpStatus.OK).json({ message: 'Пользователь успешно вышел из системы' });
  }

  @ApiOperation({ summary: 'Получить новые токены' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Токены успешно сгенерированы',
    type: AccessTokenResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не авторизован',
    type: ResponseErrorMessageDto,
  })
  @Get('refresh-tokens')
  async refreshTokens(
    @Cookie(CookiesEnum.REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refreshTokens(refreshToken, agent);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  private setRefreshTokenToCookies(tokens: ITokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    res.cookie(CookiesEnum.REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.expired),
      secure:
        this.configService.get('VERCEL_NODE_ENV', 'development') ===
        'production',
      path: '/',
    });

    res
      .status(HttpStatus.CREATED)
      .json({ accessToken: tokens.accessToken })
      .send();
  }
}
