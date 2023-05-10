import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AUTH_GUARD, AUTH_UPDATE } from 'src/app/interceptors/contexts';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserVerificationHttpService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  /* -------------------- */

  request() {
    return this._httpClient.post(`backend:/auth/v1/system-user/verification/request`, null, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
    });
  }

  verify(hash: string) {
    return this._httpClient.patch(`backend:/auth/v1/system-user/verification/verify?hash=${hash}`, null, {
      context: new HttpContext()
        .set(AUTH_GUARD, 'systemUser')
        .set(AUTH_UPDATE, () => {
          return {
            isVerified: true,
          };
        })
    });
  }
}
