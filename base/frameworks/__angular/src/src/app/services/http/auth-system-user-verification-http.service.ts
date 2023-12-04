import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GUARD, ON_SUCCESS } from 'src/app/interceptors/contexts';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserVerificationHttpService {

  constructor(
    private _httpClient: HttpClient,
    private _authS: AuthService,
  ) { }

  /* -------------------- */

  request = () => {
    return this._httpClient.post(`${environment.backendUrl}/auth/v1/system-user/verification/request`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }

  verify = (hash: string) => {
    return this._httpClient.patch(`${environment.backendUrl}/auth/v1/system-user/verification/verify?hash=${hash}`, null, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
        .set(ON_SUCCESS, res => {
          this._authS.systemUser().guard().mutate(auth => {
            if (auth?.data) {
              auth.data.isVerified = true;
            }
          });
        })
    });
  }
}
