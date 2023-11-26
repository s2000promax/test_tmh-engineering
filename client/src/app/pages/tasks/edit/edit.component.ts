import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { MatNativeDateModule, ThemePalette } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../core/services/task/task.service';
import { UserService } from '../../../core/services/user/user.service';
import { ITask } from '../../../core/interfaces/task/task.interface';
import { StatusSelectComponent } from '../../../components/selects/status-select/status-select.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    NgIf,
    RouterLink,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    StatusSelectComponent,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit, OnDestroy {
  public readonly defaultColor: ThemePalette | undefined = 'primary';

  public taskForm!: FormGroup;
  private data!: ITask;

  public submitted: boolean = false;
  public error: string = '';

  private taskSubscription!: Subscription;

  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dueDate: [new Date(), [Validators.required]],
      category: ['', []],
    });
  }

  onSubmit() {
    if (!this.taskForm.invalid) {
      this.error = '';
      this.submitted = true;

      const data: ITask = {
        ...this.taskForm.getRawValue(),
        ownerId: this.userService.currentUser.value?.id,
      };

      this.taskSubscription = this.taskService.updateTask(data).subscribe({
        next: () => {
          this.taskForm.reset();
          this.submitted = false;

          this.router.navigate(['tasks', 'list']);
        },
        error: (err) => {
          this.submitted = false;
          this.error = err.error.message;
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }
}
