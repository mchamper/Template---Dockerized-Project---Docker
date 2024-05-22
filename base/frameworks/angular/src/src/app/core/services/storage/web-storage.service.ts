import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { defaultTo } from 'lodash';
import { base64Decode, base64Encode } from '../../utils/helpers/hash.helper';
import { AbstractStorageService, TStoreOptions } from './abstract-storage.service';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService extends AbstractStorageService {

  private _localStorage = inject(LocalStorageService);

  /* -------------------- */

  override async get(key: string, options?: TStoreOptions): Promise<any> {
    let value = this._localStorage.retrieve(key);

    if (value) {
      try {
        value = options?.base64
          ? base64Decode(value)
          : JSON.parse(value);
      } catch (err) {
        value = null;
      }
    }

    return Promise.resolve(defaultTo(value, null));
  }

  override async set(key: string, value: any, options?: TStoreOptions): Promise<void> {
    value = options?.base64
      ? base64Encode(value)
      : JSON.stringify(value);

    this._localStorage.store(key, value);

    return Promise.resolve();
  }

  override async remove(key: string): Promise<void> {
    this._localStorage.clear(key);
    return Promise.resolve();
  }

  override async clear(): Promise<void> {
    this._localStorage.clear();
    return Promise.resolve();
  }
}
