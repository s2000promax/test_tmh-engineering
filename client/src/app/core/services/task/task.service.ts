import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ITask,
  ITaskRequest,
  ITaskResponse,
} from '../../interfaces/task/task.interface';
import { environment } from '@environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public taskList = new BehaviorSubject<ITask[]>([]);
  public taskList$ = this.taskList.asObservable();

  private readonly http = inject(HttpClient);

  public fetchTaskList() {
    return this.http.get<ITask[]>(environment.apiUrl + '/task/list').pipe(
      tap((response) => {
        this.taskList.next(response);
      }),
    );
  }

  public fetchTaskById(id: string) {
    return this.http.get<ITask>(environment.apiUrl + `/task/${id}`);
  }

  public createTask(data: ITaskRequest) {
    return this.http.post<ITaskResponse>(
      environment.apiUrl + '/task/create',
      data,
    );
  }

  public updateTask(data: ITask) {
    return this.http.put<ITaskResponse>(environment.apiUrl + '/task', data);
  }

  public deleteTask(id: string) {
    return this.http.delete<ITaskResponse>(environment.apiUrl + `/task/${id}`);
  }
}
