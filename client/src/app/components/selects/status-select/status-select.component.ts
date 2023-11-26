import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ISelectForm } from '../../../core/interfaces/forms/select-form.interface';
import { StatusEnum } from '../../../core/enums/status.enum';

@Component({
  selector: 'app-status-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './status-select.component.html',
  styleUrls: ['./status-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusSelectComponent implements OnInit {
  public statusSelectForm!: FormGroup;

  statuses: ISelectForm[] = Object.entries(StatusEnum).map(
    ([value, viewValue]) => {
      return { value, viewValue };
    },
  );

  private readonly fb = inject(FormBuilder);

  ngOnInit() {
    this.statusSelectForm = this.fb.group({
      status: [''],
    });
  }
}
