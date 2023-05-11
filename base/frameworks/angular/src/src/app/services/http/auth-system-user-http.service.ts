import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AUTH_LOGIN, AUTH_GUARD, AUTH_UPDATE, AUTH_LOGIN_AS, AUTH_LOGOUT, AUTH_LOGOUT_ON_ERROR } from 'src/app/interceptors/contexts';
import { IHttpResponse } from 'src/app/interceptors/success.interceptor';
import { AuthService } from '../auth.service';
import { SystemUser } from 'src/app/models/system-user';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserHttpService {

  constructor(
    private _httpClient: HttpClient,
    private _authS: AuthService,
  ) { }

  /* -------------------- */

  register(input: any) {
    return this._httpClient.post(`backend:/auth/v1/system-user/register`, input, {
      context: new HttpContext()
    });
  }

  login(input: { email: string, password: string, remember_me: boolean }) {
    return this._httpClient.post(`backend:/auth/v1/system-user/login`, input, {
      context: new HttpContext()
        .set(AUTH_LOGIN_AS, 'systemUser')
        .set(AUTH_LOGIN, (res: IHttpResponse) => {
          const systemUser = new SystemUser(res.body.data, 'backend');
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          return {
            data: systemUser.parseForAuthData(),
            token,
            tokenExpiresAt,
          };
        })
    });
  }

  loginGoogle(input: any) {
    return this._httpClient.post(`backend:/auth/v1/system-user/login/google`, input, {
      context: new HttpContext()
        .set(AUTH_LOGIN_AS, 'systemUser')
        .set(AUTH_LOGIN, (res: IHttpResponse) => {
          const systemUser = new SystemUser(res.body.data, 'backend');
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          return {
            data: systemUser.parseForAuthData(),
            token,
            tokenExpiresAt,
          };
        })
    });
  }

  logout() {
    this._authS.logout('systemUser');

    return this._httpClient.post(`backend:/auth/v1/system-user/logout`, null, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
    });
  }

  me() {
    return this._httpClient.get(`backend:/auth/v1/system-user/me`, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(AUTH_LOGOUT_ON_ERROR, true)
        .set(AUTH_UPDATE, (res: IHttpResponse) => {
          const systemUser = new SystemUser(res.body.data, 'backend');
          return systemUser.parseForAuthData();
        })
    });
  }

  /* -------------------- */

  update(input: any) {
    return this._httpClient.put(`backend:/auth/v1/system-user/update`, input, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(AUTH_UPDATE, (res: IHttpResponse) => {
          const systemUser = new SystemUser(res.body.data, 'backend');
          return systemUser.parseForAuthData();
        })
    });
  }
}
