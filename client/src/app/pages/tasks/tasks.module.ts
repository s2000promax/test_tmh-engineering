import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from '@pages/tasks/tasks-routing.module';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';

@NgModule({
  declarations: [TasksComponent],
  imports: [CommonModule, TasksRoutingModule, ToolbarComponent],
})
export class TasksModule {}
