import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from '@pages/tasks/tasks.component';
import { authorizedGuard } from '../../core/guards/authorized.guard';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./list/list.component').then((c) => c.ListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./create/create.component').then((c) => c.CreateComponent),
        canActivate: [authorizedGuard(true)],
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./edit/edit.component').then((c) => c.EditComponent),
        canActivate: [authorizedGuard(true)],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
