import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    DatePipe,
    AsyncPipe,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit, OnDestroy {
  public readonly defaultColor: ThemePalette | undefined = 'primary';
  public readonly warnColor: ThemePalette | undefined = 'warn';
  public editMode: boolean = false;
  public isOwnerTask: boolean = false;

  public taskForm!: FormGroup;
  public formData!: ITask;

  public submitted: boolean = false;
  public error: string = '';

  private taskUpdateSubscription!: Subscription;
  private taskDeleteSubscription!: Subscription;

  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  public readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    const { id } = this.route.snapshot.params;
    this.taskService.fetchTaskById(id).subscribe({
      next: (response) => {
        this.formData = {
          ...response,
        };

        if (response.ownerId === this.userService.currentUser.value?.id) {
          this.isOwnerTask = true;
        }
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  public onEditToggle() {
    this.editMode = true;

    this.taskForm = this.fb.group({
      title: [this.formData.title, [Validators.required]],
      description: [this.formData.description, [Validators.required]],
      dueDate: [new Date(this.formData.dueDate), [Validators.required]],
      category: [this.formData.category, []],
    });
  }

  public onDeleteTask() {
    const { id } = this.route.snapshot.params;

    this.taskDeleteSubscription = this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.router.navigate(['tasks', 'list']);
      },
    });
  }

  onSubmit() {
    if (!this.taskForm.invalid) {
      this.error = '';
      this.submitted = true;

      const data: ITask = {
        ...this.formData,
        ...this.taskForm.getRawValue(),
      };

      this.taskUpdateSubscription = this.taskService
        .updateTask(data)
        .subscribe({
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
    if (this.taskUpdateSubscription) {
      this.taskUpdateSubscription.unsubscribe();
    }

    if (this.taskDeleteSubscription) {
      this.taskDeleteSubscription.unsubscribe();
    }
  }
}
