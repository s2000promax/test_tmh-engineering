import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '@pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'default',
        loadComponent: () =>
          import(
            '../../components/profile/editable-profile/editable-profile.component'
          ).then((c) => c.EditableProfileComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            '../../components/profile/details-profile/details-profile.component'
          ).then((c) => c.DetailsProfileComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
