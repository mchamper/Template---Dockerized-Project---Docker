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
    return this._httpClient.post(`backendLaravel:/auth/system-user/password-reset/request`, input, {
      context: new HttpContext()
    });
  }

  update(hash: string, input: any) {
    return this._httpClient.patch(`backendLaravel:/auth/system-user/password-reset/update?hash=${hash}`, input, {
      context: new HttpContext()
    });
  }
}
