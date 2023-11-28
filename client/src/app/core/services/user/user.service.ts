import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { IProfile, IUser } from '../../interfaces/user/user.inteface';
import { RolesEnum } from '../../enums/roles.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IResponseMessage } from '../../interfaces/http/response-message.interface';

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
  public isCurrentUserAdmin = this.currentUserRoles$.pipe(
    map((roles) => roles.some((role) => this.adminRoles.includes(role))),
  );

  public readonly isAuthenticated$ = this.currentUser.pipe(
    map((user) => !!user),
  );

  public setCurrentUserData(data: IUser | null) {
    this.currentUser.next(data);
    if (data?.roles) {
      this.currentUserRoles.next(data.roles);
    } else {
      this.currentUserRoles.next([]);
    }
  }

  public fetchCurrentUser() {
    return this.http.get<IUser>(environment.apiUrl + '/user/me');
  }

  public fetchUserProfileById(id: string) {
    return this.http.get<IProfile>(environment.apiUrl + `/user/${id}`);
  }

  public updateUserProfile(profile: IProfile) {
    return this.http.put<IResponseMessage>(
      environment.apiUrl + '/user',
      profile,
    );
  }

  public deleteUserById(id: string) {
    return this.http.delete<IResponseMessage>(
      environment.apiUrl + `/user/${id}`,
    );
  }
}
