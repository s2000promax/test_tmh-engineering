import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MessageResponseDto } from './auth/dto';
import { ResponseErrorMessageDto } from '../config/dto';
import { Response } from 'express';
import { Public } from '../libs/decorators';

@ApiTags('status')
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Получить статус сервера' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @Get()
  async getServerStatus(@Res() res: Response) {
    res
      .status(HttpStatus.OK)
      .json({ message: this.appService.getServerStatus() });
  }
}
