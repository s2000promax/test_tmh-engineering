import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { IUser } from '../interfaces/user.inteface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public readonly currentUser = new BehaviorSubject<IUser | null>(null);
  public readonly isAuthenticated$ = this.currentUser.pipe(
    map((user) => !!user),
  );

  public setCurrentUserData(data: IUser | null) {
    this.currentUser.next(data);
  }
}
