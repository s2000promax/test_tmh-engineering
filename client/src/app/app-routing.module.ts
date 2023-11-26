import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authorizedGuard } from './core/guards/authorized.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [authorizedGuard(false)],
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./pages/tasks/tasks.module').then((m) => m.TasksModule),
    canActivate: [authorizedGuard(false)],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [authorizedGuard(true)],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
