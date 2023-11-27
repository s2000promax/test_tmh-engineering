import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService!: AuthService;
  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }

    request = request.clone({
      setHeaders: {
        Authorization: this.authService.getAccessToken() ?? '',
      },
    });

    return next.handle(request);
  }
}
