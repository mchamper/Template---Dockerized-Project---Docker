import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GUARD, ON_ERROR, ON_SUCCESS } from '../../core/interceptors/contexts';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { THttpResponse } from '../../core/types/http-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthAppClientHttpService {

  private _httpClient = inject(HttpClient);
  private _authS = inject(AuthService);

  /* -------------------- */

  login = (input: { key: string, secret: string }) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/app-client/login`, input, {
      context: new HttpContext()
        .set(ON_SUCCESS, res => {
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          this._authS.appClient().addSession({
            token,
            tokenExpiresAt,
            refreshToken: '',
          });
        })
    });
  }

  logout = () => {
    this._authS.appClient().removeSession();

    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/app-client/logout`, null, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
    });
  }

  me = () => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/app-client/me`, null, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
        .set(ON_ERROR, err => {
          if (err.status === 401) {
            this._authS.appClient().removeSession();
          }
        })
    });
  }
}
