import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

export interface IUploadResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly http = inject(HttpClient);

  public fileUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(environment.apiUrl + '/upload', formData);
  }
}
