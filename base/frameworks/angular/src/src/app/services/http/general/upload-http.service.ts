import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GUARD } from '../../../core/interceptors/contexts';
import { environment } from '../../../../environments/environment';
import { THttpResponse } from '../../../core/types/http-response.type';

@Injectable({
  providedIn: 'root'
})
export class UploadHttpService {

  private _httpClient = inject(HttpClient);

  /* -------------------- */

  upload = (concept: string, input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/upload?concept=${concept}`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }
}
