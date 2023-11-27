import { CurrentUser, Public } from '../../libs/decorators';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Res,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtPayloadDto, ResponseErrorMessageDto } from '../../config/dto';
import { TaskService } from './task.service';
import { TaskResponseDto } from './dto';
import { UserProfileDto } from '../user/dto';
import { MessageResponseDto } from '../auth/dto';
import { Response } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { CookiesEnum } from '../../config/enums/cookies.enum';
import { Task } from '@prisma/client';

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
  async createTask(@Body() dto: CreateTaskDto, @Res() res: Response) {
    const task = await this.taskService.createTask(dto);

    if (!task) {
      throw new BadRequestException('Не удалось создать задание');
    }

    res.status(HttpStatus.CREATED).json({ message: 'Задание успешно создано' });
  }

  @ApiOperation({ summary: 'Обновление задания' })
  @ApiBody({
    type: UserProfileDto,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Задание было успешно обновлено',
    type: MessageResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не авторизирован',
    type: ResponseErrorMessageDto,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Запрещено',
    type: ResponseErrorMessageDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  async updateTask(
    @Body() body: Task,
    @CurrentUser() currentUser: JwtPayloadDto,
    @Res() res: Response,
  ) {
    await this.taskService.updateTask(body, currentUser);

    res.status(HttpStatus.OK).json({ message: 'Задание успешно обновлено' });
  }

  @ApiOperation({ summary: 'Удалить задание по ID' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Задание успешно удалено',
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Запрещенное исключение',
    type: ResponseErrorMessageDto,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не авторизирован',
    type: ResponseErrorMessageDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
    type: ResponseErrorMessageDto,
  })
  @ApiCookieAuth(CookiesEnum.REFRESH_TOKEN)
  @Delete(':id')
  async deleteTask(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayloadDto,
    @Res() res: Response,
  ) {
    await this.taskService.deleteTask(id, currentUser);

    res.status(HttpStatus.OK).json({ message: 'Задание успешно удалено' });
  }
}
