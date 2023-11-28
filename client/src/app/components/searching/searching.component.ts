import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task/task.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-searching',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchingComponent implements OnInit {
  public searchTerm: string = '';
  private taskService = inject(TaskService);

  ngOnInit() {
    this.searchTerm = this.taskService.query_search;
  }

  onSearch() {
    this.taskService.query_search = this.searchTerm;

    this.taskService.fetchTaskList().pipe(take(1)).subscribe();
  }
}
