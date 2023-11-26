import { ITask } from '../task/task.interface';

export interface ITaskForm
  extends Pick<ITask, 'title' | 'description' | 'dueDate' | 'category'> {}
