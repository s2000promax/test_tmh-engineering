import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ISelectForm } from '../../../core/interfaces/forms/select-form.interface';
import { CategoryEnum } from '../../../core/enums/category.enum';
import { TaskService } from '../../../core/services/task/task.service';
import { take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySelectComponent implements OnInit {
  public categorySelectForm!: FormGroup;

  categories: ISelectForm[] = Object.entries(CategoryEnum).map(
    ([value, viewValue]) => {
      return { value, viewValue };
    },
  );

  private readonly fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  ngOnInit() {
    this.categorySelectForm = this.fb.group({
      category: [''],
    });
  }

  onCategoryChange(event: MatSelectChange) {
    this.taskService.query_category = event.value;
    this.handleFetchTaskList();
  }

  clearSelection() {
    this.categorySelectForm.get('category')!.setValue(null);
    this.taskService.query_category = '';
    this.handleFetchTaskList();
  }

  private handleFetchTaskList() {
    this.taskService.fetchTaskList().pipe(take(1)).subscribe();
  }
}
