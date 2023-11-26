import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  public tagList = new BehaviorSubject<string[]>([]);
  public tagList$ = this.tagList.asObservable();

  private readonly http = inject(HttpClient);

  public fetchTagList() {
    return this.http
      .get<string[]>(environment.apiUrl + '/tags')
      .pipe(tap((response) => this.tagList.next(response)));
  }
}
