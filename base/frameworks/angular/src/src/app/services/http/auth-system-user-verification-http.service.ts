import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { THttpResponse } from '../../core/types/http-response.type';
import { AuthService } from '../auth.service';
import { GUARD, ON_SUCCESS } from '../../core/interceptors/contexts';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserVerificationHttpService {

  private _httpClient = inject(HttpClient);
  private _authS = inject(AuthService);

  /* -------------------- */

  request = () => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/verification/request`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }

  verify = (hash: string) => {
    return this._httpClient.patch<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/verification/verify?hash=${hash}`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => {
          this._authS.systemUser().updateSession({
            data: {
              isVerified: true,
            }
          });
        })
    });
  }
}
