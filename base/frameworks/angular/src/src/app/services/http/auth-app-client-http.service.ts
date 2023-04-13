import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AUTH_LOGIN, AUTH_LOGOUT_ON_ERROR } from 'src/app/interceptors/contexts';
import { IHttpResponse } from 'src/app/interceptors/success.interceptor';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAppClientHttpService {

  constructor(
    private _httpClient: HttpClient,
    private _authS: AuthService,
  ) { }

  /* -------------------- */

  login(input: { key: string, secret: string }) {
    return this._httpClient.post(`backendLaravel:/auth/v1/app-client/login`, input, {
      context: new HttpContext()
        .set(AUTH_LOGIN, (res: IHttpResponse) => {
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          return {
            data: {},
            token,
            tokenExpiresAt,
          };
        })
    });
  }

  logout() {
    this._authS.logout('appClient');

    return this._httpClient.post(`backendLaravel:/auth/v1/app-client/logout`, null, {
      context: new HttpContext()
    });
  }

  me() {
    return this._httpClient.get(`backendLaravel:/auth/v1/app-client/me`, {
      context: new HttpContext()
        .set(AUTH_LOGOUT_ON_ERROR, true)
    });
  }
}
