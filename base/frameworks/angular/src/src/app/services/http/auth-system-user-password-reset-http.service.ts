import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserPasswordResetHttpService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  /* -------------------- */

  request(input: any) {
    return this._httpClient.post(`backend:/auth/v1/system-user/password-reset/request`, input, {
      context: new HttpContext()
    });
  }

  update(hash: string, input: any) {
    return this._httpClient.patch(`backend:/auth/v1/system-user/password-reset/update?hash=${hash}`, input, {
      context: new HttpContext()
    });
  }
}
