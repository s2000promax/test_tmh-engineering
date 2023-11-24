import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from '@pages/tasks/tasks.component';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      /*
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import(
            '../../products/components/product-list/product-list.component'
          ).then((c) => c.ProductListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            '../../products/components/product-create/product-create.component'
          ).then((c) => c.ProductCreateComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import(
            '../../products/components/product-edit/product-edit.component'
          ).then((c) => c.ProductEditComponent),
      },
      */
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
