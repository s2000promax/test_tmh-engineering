import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        console.log('Соединение с базой данных выполнено успешно');
      })
      .catch((e) => {
        console.log('Ошибка подключения к базе данных', e);
      });
  }
}
