import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GUARD } from '../../../core/interceptors/contexts';
import { environment } from '../../../../environments/environment';
import { THttpResponse } from '../../../core/types/http-response.type';

@Injectable({
  providedIn: 'root'
})
export class SearchHttpService {

  private _httpClient = inject(HttpClient);

  /* -------------------- */

  search = (concept: string, query: string) => {
    return this._httpClient.get<THttpResponse>(`${environment.backendUrl}/api/backoffice/v1/search?concept=${concept}&query=${query}`, {
      context: new HttpContext()
        .set(GUARD, 'systemUser')
    });
  }
}
