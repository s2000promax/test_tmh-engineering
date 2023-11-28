import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CategoryEnum, RoleEnum, Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtPayloadDto } from '../../config/dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findAllTasks(search: string, category: string): Promise<Task[]> {
    const searchConditions: any = {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          status: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    };

    if (
      category &&
      Object.values(CategoryEnum).includes(category as CategoryEnum)
    ) {
      searchConditions.category = { equals: category };
    }

    const tasks = await this.prismaService.task.findMany({
      where: searchConditions,
      include: {
        user: {
          include: {
            Profile: true,
          },
        },
      },
    });

    return tasks.map((task) => {
      return {
        ...task,
        ownerProfile: task.user?.Profile?.[0] || null,
        user: undefined,
      };
    });
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
        category: task?.category ? task.category : null,
      },
    });

    return newTask;
  }

  async updateTask(task: Task, currentUser: JwtPayloadDto): Promise<Task> {
    if (
      task.ownerId !== currentUser.id &&
      !this.isUserAdmin(currentUser.roles)
    ) {
      throw new ForbiddenException();
    }

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

  async deleteTask(id: string, currentUser: JwtPayloadDto) {
    const task = await this.findTaskById(id);

    if (
      task.ownerId !== currentUser.id &&
      !this.isUserAdmin(currentUser.roles)
    ) {
      throw new ForbiddenException();
    }

    const deletedTask = await this.prismaService.task.delete({
      where: {
        id,
      },
    });

    return deletedTask;
  }

  private isUserAdmin(currentUserRoles: RoleEnum[]) {
    const adminRoles = [RoleEnum.ADMIN, RoleEnum.SA];

    return adminRoles.some((role) => currentUserRoles.includes(role));
  }
}
