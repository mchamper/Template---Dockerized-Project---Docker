import { Injectable, inject } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment';
import { defaultTo } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _localStorage = inject(LocalStorageService);
  private _sessionStorage = inject(SessionStorageService);

 /* -------------------- */

  constructor() {
    const storageVersion = this.get('storageVersion') as number;

    if (!storageVersion || storageVersion !== environment.storageVersion) {
      this.clear();
      this.clearSession();

      this.set('storageVersion', environment.storageVersion);
    }
  }

  /* -------------------- */

  get(key: string, defaultValue: any = null, options?: { session?: boolean }): any {
    let value = options?.session
      ? this._sessionStorage.retrieve(key)
      : this._localStorage.retrieve(key);

    if (value) {
      try {
        value = JSON.parse(value);
      } catch (err) {
        value = null;
      }
    }

    return defaultTo(value, defaultValue);
  }
  getSession(key: string): any {
    return this.get(key, { session: true });
  }

  set(key: string, value: any, options?: { session?: boolean }): void {
    value = JSON.stringify(value);

    options?.session
      ? this._sessionStorage.store(key, value)
      : this._localStorage.store(key, value);
  }
  setSession(key: string, value: any): void {
    return this.set(key, value, { session: true });
  }

  clear(key?: string, options?: { session?: boolean }): void {
    options?.session
      ? this._sessionStorage.clear(key)
      : this._localStorage.clear(key);
  }
  clearSession(key?: string): void {
    this.clear(key, { session: true });
  }
}
