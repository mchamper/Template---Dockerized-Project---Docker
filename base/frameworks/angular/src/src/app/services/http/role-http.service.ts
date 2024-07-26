import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { queryParamsParser } from '../../core/utils/parsers/query-param.parser';
import { environment } from '../../../environments/environment';
import { GUARD } from '../../core/interceptors/contexts';
import { THttpResponse } from '../../core/types/http-response.type';

@Injectable({
  providedIn: 'root'
})
export class RoleHttpService {

  private _httpClient = inject(HttpClient);

  /* -------------------- */

  getList = (params?: any) => {
    const queryParams = queryParamsParser(params);

    return this._httpClient.get<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/roles?${queryParams}`, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }

  create = (input: any) => {
    return this._httpClient.post<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/roles`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }

  update = (roleId: number, input: any) => {
    return this._httpClient.put<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/roles/${roleId}`, input, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }

  delete = (roleId: number) => {
    return this._httpClient.delete<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/roles/${roleId}`, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }
}
