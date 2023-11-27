import { Injectable, Logger } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Tag[]> {
    const tags = await this.prismaService.tag.findMany({});

    return tags;
  }
}
