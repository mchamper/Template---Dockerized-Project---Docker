import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AUTH_GUARD } from 'src/app/interceptors/contexts';
import { parseQueryParams } from 'src/app/helper';

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
    });
  }

  create(input: any) {
    return this._httpClient.post(`backend:/api/v1/backoffice/system-users`, input, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
    });
  }
}
