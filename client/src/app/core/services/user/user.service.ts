import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { IUser } from '../../interfaces/user/user.inteface';
import { RolesEnum } from '../../enums/roles.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  public currentUser = new BehaviorSubject<IUser | null>(null);

  private currentUserId = new BehaviorSubject<string | null>(null);
  private currentUserRoles = new BehaviorSubject<RolesEnum[]>([]);

  public currentUserId$ = this.currentUserId.asObservable();
  public currentUserRoles$ = this.currentUserRoles.asObservable();

  private readonly adminRoles: RolesEnum[] = [RolesEnum.SA, RolesEnum.ADMIN];
  public isCurrentUserAdmin$ = this.currentUserRoles$.pipe(
    map((roles) => roles.some((role) => this.adminRoles.includes(role))),
  );

  public readonly isAuthenticated$ = this.currentUser.pipe(
    map((user) => !!user),
  );

  public setCurrentUserData(data: IUser | null) {
    this.currentUser.next(data);
  }

  public fetchCurrentUser() {
    return this.http.get<IUser>(environment.apiUrl + '/user/me');
  }
}
