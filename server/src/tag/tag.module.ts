import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  providers: [TagService],
  exports: [TagService],
  controllers: [TagController],
  imports: [],
})
export class TagModule {}
