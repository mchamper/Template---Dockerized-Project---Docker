import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CombosHttpService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /* -------------------- */

  get(concepts: string) {
    return this._httpClient.get(`backend:/api/v1/backoffice/combos?concepts=${concepts}`, {
      context: new HttpContext()
    });
  }
}
