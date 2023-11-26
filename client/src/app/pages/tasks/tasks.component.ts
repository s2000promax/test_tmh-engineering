import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tasks',
  template: `
    <app-toolbar></app-toolbar>
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {}
