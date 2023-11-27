import { Injectable, Logger } from '@nestjs/common';
import { Tag, Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findAllTasks(): Promise<Task[]> {
    const tasks = await this.prismaService.task.findMany({});

    return tasks;
  }

  async findTaskById(id: string): Promise<Task> {
    const task = await this.prismaService.task.findFirst({
      where: {
        id,
      },
    });

    return task;
  }

  async createTask(task: CreateTaskDto): Promise<Task> {
    const newTask = await this.prismaService.task.create({
      data: {
        ownerId: task.ownerId,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        attachments: task.attachments,
        category: task?.category,
      },
    });

    return newTask;
  }

  async updateTask(task: Task): Promise<Task> {
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: task.id,
      },
      data: {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        category: task?.category,
        attachments: task.attachments,
      },
    });

    return updatedTask;
  }

  async deleteTask(id: string) {
    const deletedTask = await this.prismaService.task.delete({
      where: {
        id,
      },
    });

    return deletedTask;
  }
}
