import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GUARD } from '../../core/interceptors/contexts';
import { environment } from '../../../environments/environment';
import { THttpResponse } from '../../core/types/http-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserPasswordResetHttpService {

  private _httpClient = inject(HttpClient);

  /* -------------------- */

  request = (input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/password-reset/request`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
    });
  }

  update = (hash: string, input: any) => {
    return this._httpClient.patch<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/password-reset/update?hash=${hash}`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
    });
  }
}
