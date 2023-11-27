import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum, Task } from '@prisma/client';

export class TaskResponseDto implements Task {
  @ApiProperty()
  id: string;
  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  attachments: string[];

  @ApiProperty()
  category: CategoryEnum;
}
