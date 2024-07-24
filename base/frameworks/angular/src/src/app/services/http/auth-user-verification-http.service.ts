import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { THttpResponse } from '../../core/types/http-response.type';
import { AuthService } from '../auth.service';
import { GUARD, ON_SUCCESS } from '../../core/interceptors/contexts';
import { environment } from '../../../environments/environment';
import { kebabCase } from 'lodash';
import { TAuthGuardName } from '../../core/services/abstract-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserVerificationHttpService {

  private _httpClient = inject(HttpClient);
  private _authS = inject(AuthService);

  /* -------------------- */

  request = (userType: TAuthGuardName) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/verification/request`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }

  verify = (userType: TAuthGuardName, hash: string) => {
    return this._httpClient.patch<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/verification/verify?hash=${hash}`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => this._authS.guard(userType).updateSession({ data: { isVerified: true } }))
    });
  }
}
