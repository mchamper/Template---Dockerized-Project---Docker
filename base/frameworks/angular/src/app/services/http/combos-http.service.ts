import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './core/http.service';

@Injectable({
  providedIn: 'root'
})
export class CombosHttpService {

  constructor(
    private _http: HttpService,
    private _httpClient: HttpClient,
  ) { }

  /* -------------------- */

  get(concepts: string) {
    return this._httpClient.get(this._http.getEndpoint(`/combos?concepts=${concepts}`), {
      headers: this._http.getHeaders(),
    });
  }
}
