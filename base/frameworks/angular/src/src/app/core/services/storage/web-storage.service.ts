import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { defaultTo } from 'lodash';
import { AbstractStorageService } from './abstract-storage.service';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService extends AbstractStorageService {

  private _localStorage = inject(LocalStorageService);

  /* -------------------- */

  protected override async _get(key: string): Promise<any> {
    return Promise.resolve(defaultTo(this._decodeValue(this._localStorage.retrieve(key)), undefined));
  }

  protected override async _set(key: string, value: any): Promise<void> {
    this._localStorage.store(key, this._encodeValue(value));
    return Promise.resolve();
  }

  protected override async _remove(key: string): Promise<void> {
    this._localStorage.clear(key);
    return Promise.resolve();
  }

  protected override async _clear(): Promise<void> {
    this._localStorage.clear();
    return Promise.resolve();
  }
}
