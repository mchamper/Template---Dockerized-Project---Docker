import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GUARD } from 'src/app/interceptors/contexts';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CombosHttpService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /* -------------------- */

  get = (concepts: string) => {
    return this._httpClient.get(`${environment.backendUrl}/api/backoffice/v1/combos?concepts=${concepts}`, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }
}
