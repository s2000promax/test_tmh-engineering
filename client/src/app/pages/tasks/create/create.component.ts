import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {
  MatNativeDateModule,
  MatOptionModule,
  ThemePalette,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskService } from '../../../core/services/task/task.service';
import { ITask } from '../../../core/interfaces/task/task.interface';
import { StatusEnum } from '../../../core/enums/status.enum';
import { CategorySelectComponent } from '../../../components/selects/category-select/category-select.component';
import { MatSelectModule } from '@angular/material/select';
import { ISelectForm } from '../../../core/interfaces/forms/select-form.interface';
import { CategoryEnum } from '../../../core/enums/category.enum';
import { MatIconModule } from '@angular/material/icon';
import { FileUploadService } from '../../../core/services/file-upload/file-upload.service';

@Component({
  selector: 'app-create',
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
    CategorySelectComponent,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    MatIconModule,
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent implements OnInit, OnDestroy {
  public readonly defaultColor: ThemePalette | undefined = 'primary';

  public taskForm!: FormGroup;
  public attachedFileName: string = '';
  private attached: string[] = [];

  public submitted: boolean = false;
  public error: string = '';

  categories: ISelectForm[] = Object.entries(CategoryEnum).map(
    ([value, viewValue]) => {
      return { value, viewValue };
    },
  );

  private taskSubscription!: Subscription;
  private uploadFileSubscription!: Subscription;

  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

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

      const data: Partial<ITask> = {
        ...this.taskForm.getRawValue(),
        status: StatusEnum.NEW,
        attachments: this.attached,
        ownerId: this.userService.currentUser.value?.id,
      };

      this.taskSubscription = this.taskService.createTask(data).subscribe({
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

  public onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;

    if (element.files?.length) {
      this.uploadFileSubscription = this.fileUploadService
        .fileUpload(element.files[0])
        .subscribe({
          next: (response) => {
            this.attached.push(response.url);

            this.attachedFileName = element.files?.length
              ? element.files[0].name
              : '';
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.log('File', err);
          },
        });
    }
  }

  ngOnDestroy() {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }

    if (this.uploadFileSubscription) {
      this.uploadFileSubscription.unsubscribe();
    }
  }
}
