import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

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
export class SearchingComponent {
  public searchTerm: string = '';

  onSearch() {
    console.log('Поиск:', this.searchTerm);
  }
}
