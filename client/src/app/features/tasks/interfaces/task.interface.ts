import { StatusEnum } from '../../../core/enums/status.enum';

export interface ITask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: StatusEnum;
  authorId: string;
}
