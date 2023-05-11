import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AUTH_GUARD, MAP } from 'src/app/interceptors/contexts';
import { parseQueryParams } from 'src/app/helper';
import { SystemUser } from 'src/app/models/system-user';

@Injectable({
  providedIn: 'root'
})
export class SystemUserHttpService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  /* -------------------- */

  getList(params: any) {
    const queryParams = parseQueryParams(params);

    return this._httpClient.get(`backend:/api/v1/backoffice/system-users?${queryParams}`, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(MAP, res => {
          res.body.system_users.data = res.body.system_users.data.map((item: any) => new SystemUser(item, 'backend'));
          return res.body;
        })
    });
  }

  getOne(systemUserId: number, params: any) {
    const queryParams = parseQueryParams(params);

    return this._httpClient.get(`backend:/api/v1/backoffice/system-users/${systemUserId}?${queryParams}`, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(MAP, res => {
          res.body.system_user = new SystemUser(res.body.system_user, 'backend');
          return res.body;
        })
    });
  }

  create(input: any) {
    return this._httpClient.post(`backend:/api/v1/backoffice/system-users`, input, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(MAP, res => {
          res.body.system_user = new SystemUser(res.body.system_user, 'backend');
          return res.body;
        })
    });
  }

  update(systemUserId: number, input: any) {
    return this._httpClient.put(`backend:/api/v1/backoffice/system-users/${systemUserId}`, input, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(MAP, res => {
          res.body.system_user = new SystemUser(res.body.system_user, 'backend');
          return res.body;
        })
    });
  }

  delete(systemUserId: number) {
    return this._httpClient.delete(`backend:/api/v1/backoffice/system-users/${systemUserId}`, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(MAP, res => {
          res.body.system_user = new SystemUser(res.body.system_user, 'backend');
          return res.body;
        })
    });
  }

  /* -------------------- */

  activate(systemUserId: number) {
    return this._httpClient.patch(`backend:/api/v1/backoffice/system-users/${systemUserId}/activate`, null, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(MAP, res => {
          res.body.system_user = new SystemUser(res.body.system_user, 'backend');
          return res.body;
        })
    });
  }

  deactivate(systemUserId: number) {
    return this._httpClient.patch(`backend:/api/v1/backoffice/system-users/${systemUserId}/deactivate`, null, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(MAP, res => {
          res.body.system_user = new SystemUser(res.body.system_user, 'backend');
          return res.body;
        })
    });
  }
}
