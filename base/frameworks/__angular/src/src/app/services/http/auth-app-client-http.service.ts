import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GUARD, ON_ERROR, ON_SUCCESS } from 'src/app/interceptors/contexts';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthAppClientHttpService {

  constructor(
    private _httpClient: HttpClient,
    private _authS: AuthService,
  ) { }

  /* -------------------- */

  login = (input: { key: string, secret: string }) => {
    return this._httpClient.post(`${environment.backendUrl}/auth/v1/app-client/login`, input, {
      context: new HttpContext()
        .set(ON_SUCCESS, res => {
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          this._authS.appClient().login({
            token,
            tokenExpiresAt,
          });
        })
    });
  }

  logout = () => {
    this._authS.appClient().logout();

    return this._httpClient.post(`${environment.backendUrl}/auth/v1/app-client/logout`, null, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
    });
  }

  me = () => {
    return this._httpClient.get(`${environment.backendUrl}/auth/v1/app-client/me`, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
        .set(ON_ERROR, err => {
          if (err.status === 401) {
            this._authS.appClient().logout();
          }
        })
    });
  }
}
