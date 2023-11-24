import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcrypt';
import { add } from 'date-fns';
import { v4 } from 'uuid';
import { LoginDto, RegisterDto } from './dto';
import { ITokens } from './types/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async refreshTokens(refreshToken: string, agent: string): Promise<ITokens> {
    const token = await this.prismaService.token
      .delete({
        where: { token: refreshToken },
      })
      .catch((e) => {
        this.logger.error(e);
        return null;
      });

    if (!token || new Date(token.expired) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(token.userId);

    return this.generateTokens(user, agent);
  }

  async register(dto: RegisterDto) {
    const user: User = await this.userService.findOne(dto.email).catch((e) => {
      this.logger.error(e);
      return null;
    });

    if (user) {
      throw new ConflictException(
        'Пользователь с этим адресом электронной почты уже зарегистрирован',
      );
    }

    const registeredUser = this.userService.save(dto).catch((e) => {
      this.logger.error(e);
      return null;
    });

    return registeredUser;
  }

  async login(dto: LoginDto, agent: string): Promise<ITokens> {
    const user: User = await this.userService
      .findOne(dto.email, true)
      .catch((e) => {
        this.logger.error(e);
        return null;
      });

    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const tokens = this.generateTokens(user, agent);

    return tokens;
  }

  private async generateTokens(user: User, agent: string): Promise<ITokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });

    const refreshToken = await this.getRefreshToken(user.id, agent);

    return { accessToken, refreshToken };
  }

  private async getRefreshToken(userId: string, agent: string): Promise<Token> {
    const _token = await this.prismaService.token
      .findFirst({
        where: {
          userId,
          userAgent: agent,
        },
      })
      .catch((e) => {
        this.logger.error(e);
        return null;
      });

    if (_token) {
      return this.prismaService.token
        .update({
          where: { token: _token.token },
          data: {
            token: v4(),
            expired: add(new Date(), { months: 1 }),
          },
        })
        .catch((e) => {
          this.logger.error(e);
          return null;
        });
    } else {
      return this.prismaService.token
        .create({
          data: {
            token: v4(),
            expired: add(new Date(), { months: 1 }),
            userId,
            userAgent: agent,
          },
        })
        .catch((e) => {
          this.logger.error(e);
          return null;
        });
    }
  }

  async deleteRefreshToken(token: string) {
    await this.prismaService.token.delete({ where: { token } }).catch((e) => {
      this.logger.error(e);
    });
  }

  async providerAuth(email: string, agent: string, provider: string) {
    const userExists = await this.userService.findOne(email).catch((e) => {
      this.logger.error(e);
      return null;
    });

    if (userExists) {
      const user = await this.userService
        .save({ email, provider })
        .catch((e) => {
          this.logger.error(e);
          return null;
        });

      return this.generateTokens(user, agent);
    }

    const user = await this.userService.save({ email, provider }).catch((e) => {
      this.logger.error(e);
      return null;
    });

    if (!user) {
      throw new HttpException(
        `Не удалось создать пользователя в системе аутентификации ${provider}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.generateTokens(user, agent);
  }
}
