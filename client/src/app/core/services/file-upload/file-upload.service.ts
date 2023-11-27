import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IUploadResponse } from '../../interfaces/http/file-upload.interface';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly http = inject(HttpClient);

  public fileUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<IUploadResponse>(
      environment.apiUrl + '/upload',
      formData,
    );
  }
}
