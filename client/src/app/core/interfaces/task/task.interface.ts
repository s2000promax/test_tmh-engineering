import { StatusEnum } from '../../enums/status.enum';
import { CategoryEnum } from '../../enums/category.enum';

export interface Tag {
  id: string;
  name: string;
}

export interface ITask {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  status: StatusEnum;
  attachments: string[];
  tags: Tag[];
  category: CategoryEnum | null;
}

export interface ITaskRequest extends Partial<ITask> {}

export interface ITaskResponse {
  message: string;
}
