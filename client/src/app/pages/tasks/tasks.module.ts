import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from '@pages/tasks/tasks-routing.module';

@NgModule({
  declarations: [TasksComponent],
  imports: [CommonModule, TasksRoutingModule],
})
export class TasksModule {}
