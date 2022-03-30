import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    // private _translateS: TranslateService,
  ) { }

  /* -------------------- */

  getEndpoint(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }

    return environment.apiUrl + environment.apiSlug + endpoint;
  }

  getHeaders(options?: any) {
    let headers: any = {
      'Accept': 'application/json',
      // 'Accept-Language': this._translateS.currentLang,
    };

    if (options) {
      if (options.token) headers['Authorization'] = 'bearer ' + options.token;
    }

    return headers;
  }

  /* -------------------- */

  send<T>(httpClientRequest: Observable<T>): Observable<T> {
    return httpClientRequest.pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        return of(err);
      }),
      finalize(() => {
        //
      }),
    );
  }


}
