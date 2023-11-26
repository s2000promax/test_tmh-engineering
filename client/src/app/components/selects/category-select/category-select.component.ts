import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ISelectForm } from '../../../core/interfaces/forms/select-form.interface';
import { CategoryEnum } from '../../../core/enums/category.enum';

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

  ngOnInit() {
    this.categorySelectForm = this.fb.group({
      category: [''],
    });
  }
}
