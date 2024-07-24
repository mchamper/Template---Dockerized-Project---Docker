import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GUARD, ON_ERROR_401, ON_SUCCESS } from '../../core/interceptors/contexts';
import { AuthService } from '../auth.service';
import { SystemUser } from '../../models/system-user.model';
import { environment } from '../../../environments/environment';
import { THttpResponse } from '../../core/types/http-response.type';
import { kebabCase } from 'lodash';
import { TAuthGuardName } from '../../core/services/abstract-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserHttpService {

  private _httpClient = inject(HttpClient);
  private _authS = inject(AuthService);

  /* -------------------- */

  private _addSession(userType: TAuthGuardName, res: THttpResponse) {
    let user: SystemUser | undefined = undefined;

    switch (userType) {
      case 'systemUser': user = new SystemUser(res.body.user, { parser: 'backend' });
    }

    if (user) {
      const token = res.body.token;
      const tokenExpiresAt = res.body.token_expires_at;

      this._authS.guard(userType).addSession({
        token,
        tokenExpiresAt,
        refreshToken: '',
        data: user.getAuthData(),
      });
    }
  }

  private _updateSession(userType: TAuthGuardName, res: THttpResponse) {
    let user: SystemUser | undefined = undefined;

    switch (userType) {
      case 'systemUser': user = new SystemUser(res.body.user, { parser: 'backend' });
    }

    if (user) {
      this._authS.guard(userType).updateSession({
        data: user.getAuthData(),
      });
    }
  }

  /* -------------------- */

  register = (userType: TAuthGuardName, input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/register`, input, {
      context: new HttpContext()
    });
  }

  login = (userType: TAuthGuardName, input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/login`, input, {
      context: new HttpContext()
        .set(ON_SUCCESS, res => this._addSession(userType, res))
    });
  }

  loginWithGoogle = (userType: TAuthGuardName, input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/login/google`, input, {
      context: new HttpContext()
        .set(ON_SUCCESS, res => this._addSession(userType, res))
    });
  }

  loginAs = (userType: TAuthGuardName, input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/login-as`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => this._addSession(userType, res))
    });
  }

  logout = (userType: TAuthGuardName, ) => {
    this._authS.guard(userType).removeSession();

    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/logout`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }

  me = (userType: TAuthGuardName, ) => {
    return this._httpClient.get<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/me`, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => this._updateSession(userType, res))
        .set(ON_ERROR_401, err => this._authS.guard(userType).removeSession())
    });
  }

  /* -------------------- */

  update = (userType: TAuthGuardName, input: any) => {
    return this._httpClient.put<THttpResponse>(`${environment.backendUrl}/api/auth/v1/${kebabCase(userType)}/update`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => this._updateSession(userType, res))
    });
  }
}
