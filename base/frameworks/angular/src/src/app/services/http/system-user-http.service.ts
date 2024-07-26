import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { queryParamsParser } from '../../core/utils/parsers/query-param.parser';
import { environment } from '../../../environments/environment';
import { GUARD, MAP_BODY } from '../../core/interceptors/contexts';
import { SystemUser } from '../../models/system-user.model';
import { THttpResponse } from '../../core/types/http-response.type';

@Injectable({
  providedIn: 'root'
})
export class SystemUserHttpService {

  private _httpClient = inject(HttpClient);

  /* -------------------- */

  getList = (params?: any) => {
    const queryParams = queryParamsParser(params);

    return this._httpClient.get<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/system-users?${queryParams}`, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(MAP_BODY, res => {
          res.body.system_users.data = res.body.system_users.data.map((item: any) => new SystemUser(item, { parser: 'backend' }));
          return res.body;
        })
    });
  }

  getOne = (systemUserId: number, params?: any) => {
    const queryParams = queryParamsParser(params);

    return this._httpClient.get<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/system-users/${systemUserId}?${queryParams}`, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(MAP_BODY, res => {
          res.body.system_user = new SystemUser(res.body.system_user, { parser: 'backend' });
          return res.body;
        })
    });
  }

  create = (input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/system-users`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(MAP_BODY, res => {
          res.body.system_user = new SystemUser(res.body.system_user, { parser: 'backend' });
          return res.body;
        })
    });
  }

  update = (systemUserId: number, input: any) => {
    return this._httpClient.put<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/system-users/${systemUserId}`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(MAP_BODY, res => {
          res.body.system_user = new SystemUser(res.body.system_user, { parser: 'backend' });
          return res.body;
        })
    });
  }

  delete = (systemUserId: number) => {
    return this._httpClient.delete<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/system-users/${systemUserId}`, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(MAP_BODY, res => {
          res.body.system_user = new SystemUser(res.body.system_user, { parser: 'backend' });
          return res.body;
        })
    });
  }

  /* -------------------- */

  activate = (systemUserId: number) => {
    return this._httpClient.patch<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/system-users/${systemUserId}/activate`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(MAP_BODY, res => {
          res.body.system_user = new SystemUser(res.body.system_user, { parser: 'backend' });
          return res.body;
        })
    });
  }

  deactivate = (systemUserId: number) => {
    return this._httpClient.patch<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/system-users/${systemUserId}/deactivate`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(MAP_BODY, res => {
          res.body.system_user = new SystemUser(res.body.system_user, { parser: 'backend' });
          return res.body;
        })
    });
  }
}
