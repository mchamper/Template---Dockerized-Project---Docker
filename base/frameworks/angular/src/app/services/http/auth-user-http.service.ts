import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AUTH_LOGIN, AUTH_LOGOUT_ON_ERROR, AUTH_STORE_KEY, AUTH_UPDATE } from 'src/app/interceptors/contexts';

@Injectable({
  providedIn: 'root'
})
export class AuthUserHttpService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  /* -------------------- */

  login(input: { email: string, password: string, remember_me: boolean }) {
    return this._httpClient.post(`backend:/auth/user/login`, input, {
      context: new HttpContext()
        .set(AUTH_STORE_KEY, 'authSystemUser')
        .set(AUTH_LOGIN, { data: '', token: '', tokenExpiresAt: '' })
    });
  }

  me() {
    return this._httpClient.get(`backend:/auth/user/me`, {
      context: new HttpContext()
        .set(AUTH_STORE_KEY, 'authSystemUser')
        .set(AUTH_UPDATE, { data: '', token: '', tokenExpiresAt: '' })
        .set(AUTH_LOGOUT_ON_ERROR, true)
    });
  }
}
