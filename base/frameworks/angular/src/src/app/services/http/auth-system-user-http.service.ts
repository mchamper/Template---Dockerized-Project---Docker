import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AUTH_LOGIN, AUTH_GUARD, AUTH_UPDATE, AUTH_LOGIN_GUARD, AUTH_LOGOUT, AUTH_LOGOUT_ON_ERROR } from 'src/app/interceptors/contexts';
import { IHttpResponse } from 'src/app/interceptors/success.interceptor';
import { AuthService } from '../auth.service';

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
    return this._httpClient.post(`backendLaravel:/auth/v1/system-user/register`, input, {
      context: new HttpContext()
    });
  }

  login(input: { email: string, password: string, remember_me: boolean }) {
    return this._httpClient.post(`backendLaravel:/auth/v1/system-user/login`, input, {
      context: new HttpContext()
        .set(AUTH_LOGIN_GUARD, 'systemUser')
        .set(AUTH_LOGIN, (res: IHttpResponse) => {
          const data = res.body.data;
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          return {
            data: {
              id: data.id,
              email: data.email,
              name: data.full_name,
              isVerified: !!data.email_verified_at,
              firstName: data.first_name,
              lastName: data.last_name,
              picture: data.picture,
              _raw: data,
            },
            token,
            tokenExpiresAt,
          };
        })
    });
  }

  loginGoogle(input: any) {
    return this._httpClient.post(`backendLaravel:/auth/v1/system-user/login/google`, input, {
      context: new HttpContext()
        .set(AUTH_LOGIN_GUARD, 'systemUser')
        .set(AUTH_LOGIN, (res: IHttpResponse) => {
          const data = res.body.data;
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          return {
            data: {
              id: data.id,
              email: data.email,
              name: data.full_name,
              isVerified: !!data.email_verified_at,
              firstName: data.first_name,
              lastName: data.last_name,
              picture: data.social_avatar,
              _raw: data,
            },
            token,
            tokenExpiresAt,
          };
        })
    });
  }

  logout() {
    this._authS.logout('systemUser');

    return this._httpClient.post(`backendLaravel:/auth/v1/system-user/logout`, null, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
    });
  }

  me() {
    return this._httpClient.get(`backendLaravel:/auth/v1/system-user/me`, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(AUTH_LOGOUT_ON_ERROR, true)
        .set(AUTH_UPDATE, (res: IHttpResponse) => {
          const data = res.body.data;

          return {
            id: data.id,
            email: data.email,
            name: data.full_name,
            isVerified: !!data.email_verified_at,
            firstName: data.first_name,
            lastName: data.last_name,
            picture: data.picture,
            _raw: data,
          };
        })
    });
  }

  /* -------------------- */

  update(input: any) {
    return this._httpClient.put(`backendLaravel:/auth/v1/system-user/update`, input, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(AUTH_UPDATE, (res: IHttpResponse) => {
          const data = res.body.data;

          return {
            id: data.id,
            email: data.email,
            name: data.full_name,
            isVerified: !!data.email_verified_at,
            firstName: data.first_name,
            lastName: data.last_name,
            picture: data.picture,
            _raw: data,
          };
        })
    });
  }
}
