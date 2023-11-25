import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ILoginRequest,
  ILoginResponse,
} from '../../interfaces/auth/login.interface';
import { environment } from '@environments/environment';
import { BehaviorSubject } from 'rxjs';
import {
  IRegisterRequest,
  IRegisterResponse,
} from '../../interfaces/auth/register.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private accessToken = new BehaviorSubject<string | null>(null);

  public getAccessToken() {
    return this.accessToken.value;
  }

  public setAccessToken(token: string | null) {
    this.accessToken.next(token);
  }

  public login(data: ILoginRequest) {
    return this.http.post<ILoginResponse>(
      environment.apiUrl + '/auth/login',
      data,
    );
  }

  public register(data: IRegisterRequest) {
    return this.http.post<IRegisterResponse>(
      environment.apiUrl + '/auth/register',
      data,
    );
  }

  public logout() {
    return this.http.get(environment.apiUrl + '/auth/logout');
  }
}
