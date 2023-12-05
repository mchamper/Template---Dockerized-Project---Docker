import { Injectable, inject } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment';
import { defaultTo } from 'lodash';
import { base64Decode, base64Encode } from '../utils/helpers/hash.helper';

type TStoreOptions = {
  session?: boolean,
  base64?: boolean,
}

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
      this.clearAll();
      this.clearAll({ session: true });

      this.set('storageVersion', environment.storageVersion);
    }
  }

  /* -------------------- */

  get(key: string, options?: TStoreOptions): any {
    let value = options?.session
      ? this._sessionStorage.retrieve(key)
      : this._localStorage.retrieve(key);

    if (value) {
      try {
        if (options?.base64) {
          value = base64Decode(value);
        } else {
          value = JSON.parse(value);
        }
      } catch (err) {
        value = null;
      }
    }

    return defaultTo(value, null);
  }

  set(key: string, value: any, options?: TStoreOptions): void {
    if (options?.base64) {
      value = base64Encode(value);
    } else {
      value = JSON.stringify(value);
    }

    options?.session
      ? this._sessionStorage.store(key, value)
      : this._localStorage.store(key, value);
  }

  clear(key: string, options?: TStoreOptions): void {
    options?.session
      ? this._sessionStorage.clear(key)
      : this._localStorage.clear(key);
  }

  clearAll(options?: TStoreOptions): void {
    options?.session
      ? this._sessionStorage.clear()
      : this._localStorage.clear();
  }
}
