import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GUARD, ON_ERROR, ON_SUCCESS } from '../../core/interceptors/contexts';
import { AuthService } from '../auth.service';
import { SystemUser } from '../../models/system-user.model';
import { environment } from '../../../environments/environment';
import { THttpResponse } from '../../core/types/http-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserHttpService {

  private _httpClient = inject(HttpClient);
  private _authS = inject(AuthService);

  /* -------------------- */

  register = (input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/register`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
    });
  }

  login = (input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/login`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
        .set(ON_SUCCESS, res => {
          const systemUser = new SystemUser(res.body.data, { parser: 'backend' });
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          this._authS.systemUser().addSession({
            token,
            tokenExpiresAt,
            data: systemUser.getAuthData(),
          });
        })
    });
  }

  loginGoogle = (input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/login/google`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
        .set(ON_SUCCESS, res => {
          const systemUser = new SystemUser(res.body.data, { parser: 'backend' });
          const token = res.body.token;
          const tokenExpiresAt = res.body.token_expires_at;

          this._authS.systemUser().addSession({
            token,
            tokenExpiresAt,
            data: systemUser.getAuthData(),
          });
        })
    });
  }

  logout = () => {
    this._authS.systemUser().removeSession();

    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/logout`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }

  me = () => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/me`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => {
          const systemUser = new SystemUser(res.body.data, { parser: 'backend' });

          this._authS.systemUser().updateSession({
            data: systemUser.getAuthData(),
          });
        })
        .set(ON_ERROR, err => {
          if (err.status === 401) {
            this._authS.systemUser().removeSession();
          }
        })
    });
  }

  /* -------------------- */

  update = (input: any) => {
    return this._httpClient.put<THttpResponse>(`${environment.backendUrl}/auth/v1/system-user/update`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => {
          const systemUser = new SystemUser(res.body.data, { parser: 'backend' });

          this._authS.systemUser().updateSession({
            data: systemUser.getAuthData(),
          });
        })
    });
  }
}
