import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-editable-profile',
  templateUrl: './editable-profile.component.html',
  styleUrls: ['./editable-profile.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    NgIf,
    FormsModule,
  ],
})
export class EditableProfileComponent {
  editMode: boolean = false;
  user = {
    firstName: 'Name',
    lastName: 'SurANme',
  };
}
