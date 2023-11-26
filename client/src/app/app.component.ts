import { Component, inject, ViewChild } from '@angular/core';
import { map, Observable, shareReplay, take, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { ThemePalette } from '@angular/material/core';
import { AuthService } from './core/services/auth/auth.service';
import { UserService } from './core/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  public readonly defaultColor: ThemePalette | undefined = 'primary';

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly authService = inject(AuthService);
  public readonly userService = inject(UserService);
  private readonly router = inject(Router);

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  public onLogout() {
    this.authService
      .logout()
      .pipe(
        take(1),
        tap(() => {
          this.authService.setAccessToken(null);
          this.userService.setCurrentUserData(null);
          this.router.navigate(['auth', 'login']);
        }),
      )
      .subscribe();
  }
}
