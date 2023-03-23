import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AUTH_LOGIN, AUTH_LOGOUT_ON_ERROR, AUTH_GUARD, AUTH_UPDATE } from 'src/app/interceptors/contexts';
import { IHttpResponse } from 'src/app/interceptors/success.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserHttpService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  /* -------------------- */

  register(input: any) {
    return this._httpClient.post(`backendLaravel:/auth/system-user/register`, input, {
      context: new HttpContext()
    });
  }

  login(input: { email: string, password: string, remember_me: boolean }) {
    return this._httpClient.post(`backendLaravel:/auth/system-user/login`, input, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(AUTH_LOGIN, (res: IHttpResponse) => {
          const data = res.body.auth_system_user;
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

  me() {
    return this._httpClient.get(`backendLaravel:/auth/system-user/me`, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(AUTH_LOGOUT_ON_ERROR, true)
        .set(AUTH_UPDATE, (res: IHttpResponse) => {
          const data = res.body.auth_system_user;

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

  update(input: any) {
    return this._httpClient.put(`backendLaravel:/auth/system-user/update`, input, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(AUTH_UPDATE, (res: IHttpResponse) => {
          const data = res.body.auth_system_user;

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
