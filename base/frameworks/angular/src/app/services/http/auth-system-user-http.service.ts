import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AUTH_LOGIN, AUTH_LOGOUT_ON_ERROR, AUTH_STORE_KEY, AUTH_UPDATE } from 'src/app/interceptors/contexts';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserHttpService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  /* -------------------- */

  login(input: { email: string, password: string, remember_me: boolean }) {
    return this._httpClient.post(`/auth/system-user/login`, input, {
      context: new HttpContext()
        .set(AUTH_STORE_KEY, 'authSystemUser')
        .set(AUTH_LOGIN, true)
    });
  }

  me() {
    return this._httpClient.get(`/auth/system-user/me`, {
      context: new HttpContext()
        .set(AUTH_STORE_KEY, 'authSystemUser')
        .set(AUTH_UPDATE, true)
        .set(AUTH_LOGOUT_ON_ERROR, true)
    });
  }
}
