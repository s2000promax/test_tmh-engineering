import { Public } from '../../libs/decorators';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseErrorMessageDto } from '../../config/dto';
import { TaskService } from './task.service';
import { TaskResponseDto } from './dto';
import { UserResponseDto } from '../user/dto';
import {
  AccessTokenResponseDto,
  LoginDto,
  MessageResponseDto,
  RegisterDto,
} from '../auth/dto';
import { Response } from 'express';
import { UserAgent } from '../auth/decorators';
import { CreateTaskDto } from './dto/create-task.dto';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Получить все задания' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @Public()
  @Get('list')
  async findAllTasks() {
    const tasks = await this.taskService.findAllTasks();

    return tasks;
  }

  @ApiOperation({
    summary: 'Получить задание по ID',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneTask(@Param('id') id: string) {
    const task = await this.taskService.findTaskById(id);

    if (!task) {
      throw new BadRequestException('Задание не найдено');
    }

    return task;
  }

  @ApiOperation({ summary: 'Создание нового задания' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Заданое успешно создано',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
    type: ResponseErrorMessageDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  async register(@Body() dto: CreateTaskDto, @Res() res: Response) {
    const task = await this.taskService.createTask(dto);

    if (!task) {
      throw new BadRequestException('Не удалось создать задание');
    }

    res.status(HttpStatus.CREATED).json({ message: 'Задание успешно создано' });
  }
}
