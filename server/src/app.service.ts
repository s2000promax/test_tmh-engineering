import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServerStatus(): string {
    return process.env.VERCEL_NODE_ENV !== 'production'
      ? 'Сервер Вэб-приложения работает в режиме Разработки!'
      : 'Сервер Вэб-приложения работает в режиме Продакшен!';
  }
}
