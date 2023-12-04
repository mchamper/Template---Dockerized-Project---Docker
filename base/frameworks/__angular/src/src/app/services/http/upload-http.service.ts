import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GUARD } from 'src/app/interceptors/contexts';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadHttpService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /* -------------------- */

  upload = (concept: string, input: any) => {
    return this._httpClient.post(`${environment.backendUrl}/api/backoffice/v1/upload?concept=${concept}`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }
}
