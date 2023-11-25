import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { UserService } from '../services/user/user.service';

export const authorizedGuard: (checkAuthorized?: boolean) => CanActivateFn = (
  checkAuthorized: boolean = true,
) => {
  return () => {
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.isAuthenticated$.pipe(
      take(1),
      map((user) => {
        if (checkAuthorized) {
          return !!user ? true : router.parseUrl('/auth/login');
        } else {
          return !user ? true : router.parseUrl('/tasks');
        }
      }),
    );
  };
};
