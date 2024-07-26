import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { THttpResponse } from '../../core/types/http-response.type';
import { TAuthGuardName } from '../../core/services/abstract-auth.service';
import { kebabCase } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthUserPasswordResetHttpService {

  private _httpClient = inject(HttpClient);

  /* -------------------- */

  request = (userType: TAuthGuardName, input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/password-reset/request`, input, {
      context: new HttpContext()
    });
  }

  update = (userType: TAuthGuardName, hash: string, input: any) => {
    return this._httpClient.patch<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/password-reset/update?hash=${hash}`, input, {
      context: new HttpContext()
    });
  }
}
