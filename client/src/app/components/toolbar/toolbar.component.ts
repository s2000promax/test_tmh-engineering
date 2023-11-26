import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CategorySelectComponent } from '../selects/category-select/category-select.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgForOf } from '@angular/common';
import { ISelectForm } from '../../core/interfaces/forms/select-form.interface';
import { CategoryEnum } from '../../core/enums/category.enum';
import { SearchingComponent } from '../searching/searching.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    CategorySelectComponent,
    SearchingComponent,
  ],
})
export class ToolbarComponent {
  private router = inject(Router);

  onCreatePage() {
    this.router.navigate(['tasks', 'create']);
  }
}
