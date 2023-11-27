import { Public } from '../../libs/decorators';
import { Controller, Get, HttpStatus } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseErrorMessageDto } from '../../config/dto';
import { TagService } from './tag.service';
import { TagResponseDto } from './dto';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Получить все теги' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TagResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @Public()
  @Get('')
  async all() {
    const tags = await this.tagService.findAll();

    return { tags: tags.map((tag) => tag.name) };
  }
}
