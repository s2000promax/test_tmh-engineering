import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
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

    /*
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.authService.getAccessToken() ?? '',
      },
    });

     */

    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.authService.getAccessToken() ?? '',
    };

    if (request.body instanceof FormData && request.body.has('file')) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    request = request.clone({ setHeaders: headers });

    return next.handle(request);
  }
}
