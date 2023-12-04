import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GUARD, ON_ERROR, ON_SUCCESS } from 'src/app/interceptors/contexts';
import { AuthService } from '../auth.service';
import { SystemUser } from 'src/app/commons/models/system-user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserHttpService {

  constructor(
    private _httpClient: HttpClient,
    private _authS: AuthService,
  ) { }

  /* -------------------- */

  register = (input: any) => {
    return this._httpClient.post(`${environment.backendUrl}/auth/v1/system-user/register`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
    });
  }

  login = (input: { email: string, password: string, remember_me: boolean }) => {
    return this._httpClient.post(`${environment.backendUrl}/auth/v1/system-user/login`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
        .set(ON_SUCCESS, res => {
          const systemUser = new SystemUser(res.body.data, 'backend');
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          this._authS.systemUser().login({
            data: systemUser.parseForAuthData(),
            token,
            tokenExpiresAt,
          });
        })
    });
  }

  loginGoogle = (input: any) => {
    return this._httpClient.post(`${environment.backendUrl}/auth/v1/system-user/login/google`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
        .set(ON_SUCCESS, res => {
          const systemUser = new SystemUser(res.body.data, 'backend');
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          this._authS.systemUser().login({
            data: systemUser.parseForAuthData(),
            token,
            tokenExpiresAt,
          });
        })
    });
  }

  logout = () => {
    this._authS.systemUser().logout();

    return this._httpClient.post(`${environment.backendUrl}/auth/v1/system-user/logout`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }

  me = () => {
    return this._httpClient.get(`${environment.backendUrl}/auth/v1/system-user/me`, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => {
          const systemUser = new SystemUser(res.body.data, 'backend');

          this._authS.systemUser().guard().mutate(auth => {
            if (auth) {
              auth.data = systemUser.parseForAuthData();
            }
          });
        })
        .set(ON_ERROR, err => {
          if (err.status === 401) {
            this._authS.systemUser().logout();
          }
        })
    });
  }

  /* -------------------- */

  update = (input: any) => {
    return this._httpClient.put(`${environment.backendUrl}/auth/v1/system-user/update`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => {
          const systemUser = new SystemUser(res.body.data, 'backend');

          this._authS.systemUser().guard().mutate(auth => {
            if (auth) {
              auth.data = systemUser.parseForAuthData();
            }
          });
        })
    });
  }
}
