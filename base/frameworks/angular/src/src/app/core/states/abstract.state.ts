import { Injectable, Signal, effect, inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { defaultTo } from 'lodash';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractState {

  protected _storageS = inject(StorageService);

  /* -------------------- */

  protected _store<T = any>(schema: T, key: string, options: { get: (schema: T) => any, set: (schema: T, value: any) => void }) {
    options.set(schema, defaultTo(this._storageS.get(key), options.get(schema)));
    effect(() => this._storageS.set(key, options.get(schema)));

    return schema;
  }

  protected _storeDynamicKey<T = any>(schema: T, key: Signal<string>, options: { get: (schema: T) => any, set: (schema: T, value: any) => void }) {
    toObservable(key).subscribe(value => {
      if (value) {
        options.set(schema, defaultTo(this._storageS.get(value), options.get(schema)));
      }
    })

    effect(() => this._storageS.set(key(), options.get(schema)));

    return schema;
  }
}
