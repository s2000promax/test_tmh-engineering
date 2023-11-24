import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserService } from '../../user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from '../../../config/dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('VERCEL_JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDto) {
    const user: User = await this.userService
      .findOne(payload.id)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.isUserBlocked) {
      throw new ForbiddenException();
    }

    return payload;
  }
}
