import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task/task.service';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit, OnDestroy {
  public taskService = inject(TaskService);

  private taskListSubscription!: Subscription;

  ngOnInit() {
    this.taskListSubscription = this.taskService.fetchTaskList().subscribe();
  }

  ngOnDestroy() {
    if (this.taskListSubscription) {
      this.taskListSubscription.unsubscribe();
    }
  }
}
