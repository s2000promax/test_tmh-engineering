import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { JwtPayloadDto } from '../../../config/dto';

export const CurrentUser = createParamDecorator(
  (
    key: keyof JwtPayloadDto,
    ctx: ExecutionContext,
  ): JwtPayloadDto | Partial<JwtPayloadDto> => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);
