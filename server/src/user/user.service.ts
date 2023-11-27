import { convertToMillisecondsUtil } from '../../libs/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile, RoleEnum, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { Cache } from 'cache-manager';
import { JwtPayloadDto } from '../../config/dto';
import { UserProfileDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async save(user: Partial<User>) {
    const hashedPassword = user?.password
      ? this.hashPassword(user.password)
      : null;

    const savedUser = await this.prismaService.user
      .upsert({
        where: {
          email: user.email,
        },
        update: {
          password: hashedPassword ?? undefined,
          provider: user?.provider ?? undefined,
          roles: user?.roles ?? undefined,
          isUserBlocked: user?.isUserBlocked ?? undefined,
          isUserConfirmed: user?.isUserConfirmed ?? undefined,
        },
        create: {
          email: user.email,
          password: hashedPassword,
          provider: user?.provider,
          roles: ['USER'],
        },
      })
      .catch((e) => {
        this.logger.error(e);
        return null;
      });

    if (!savedUser) {
      throw new HttpException('Failed to save user', HttpStatus.BAD_REQUEST);
    }

    await this.cacheManager.set(savedUser.id, savedUser);
    await this.cacheManager.set(savedUser.email, savedUser);

    return savedUser;
  }

  async findOne(idOrEmail: string, isReset = false): Promise<User> {
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }

    const user = await this.cacheManager.get<User>(idOrEmail).catch((e) => {
      this.logger.error(e);
      return null;
    });

    if (!user) {
      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [{ id: idOrEmail }, { email: idOrEmail }],
        },
      });

      if (!user) {
        return null;
      }

      await this.cacheManager.set(
        idOrEmail,
        user,
        convertToMillisecondsUtil(this.configService.get('VERCEL_JWT_EXPIRED')),
      );

      return user;
    }

    return user;
  }

  async delete(id: string, currentUser: JwtPayloadDto) {
    if (currentUser.id === id || !this.isUserAdmin(currentUser.roles)) {
      throw new ForbiddenException();
    }

    const user = await this.findOne(id);

    if (!user) {
      return null;
    }

    await this.clearCache(user);

    return this.prismaService.user
      .delete({
        where: { id: user.id },
        select: { id: true },
      })
      .catch((e) => {
        this.logger.error(e);
        return null;
      });
  }

  async updateProfile(
    userProfile: UserProfileDto,
    currentUser: JwtPayloadDto,
  ): Promise<Profile> {
    if (
      userProfile.userId !== currentUser.id &&
      !this.isUserAdmin(currentUser.roles)
    ) {
      throw new ForbiddenException();
    }

    const updatedProfile = await this.prismaService.profile.update({
      where: {
        userId: userProfile.userId,
      },
      data: {
        fullName: userProfile.fullName,
        avatar: userProfile.avatar,
      },
    });

    return updatedProfile;
  }

  async update(user: Partial<User>, currentUser: JwtPayloadDto) {
    if (user.id !== currentUser.id && !this.isUserAdmin(currentUser.roles)) {
      throw new ForbiddenException();
    }

    const updatedUser = await this.save(user).catch((e) => {
      this.logger.error(e);
      return null;
    });

    if (updatedUser) {
      await this.clearCache(updatedUser);
      return updatedUser;
    }

    return null;
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }

  private isUserAdmin(currentUserRoles: RoleEnum[]) {
    const adminRoles = [RoleEnum.ADMIN, RoleEnum.SA];

    return adminRoles.some((role) => currentUserRoles.includes(role));
  }

  private async clearCache(user: User) {
    await Promise.all([
      this.cacheManager.del(user.id),
      this.cacheManager.del(user.email),
    ]);
  }
}
