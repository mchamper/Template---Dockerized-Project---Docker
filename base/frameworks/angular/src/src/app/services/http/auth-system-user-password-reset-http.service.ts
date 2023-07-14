import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GUARD } from 'src/app/interceptors/contexts';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserPasswordResetHttpService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  /* -------------------- */

  request = (input: any) => {
    return this._httpClient.post(`${environment.backendUrl}/auth/v1/system-user/password-reset/request`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
    });
  }

  update = (hash: string, input: any) => {
    return this._httpClient.patch(`${environment.backendUrl}/auth/v1/system-user/password-reset/update?hash=${hash}`, input, {
      context: new HttpContext()
        .set(GUARD, 'appClient')
    });
  }
}
