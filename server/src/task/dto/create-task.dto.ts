import { CategoryEnum, Task } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto implements Partial<Task> {
  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  attachments: string[];

  @ApiProperty()
  category?: CategoryEnum;
}
