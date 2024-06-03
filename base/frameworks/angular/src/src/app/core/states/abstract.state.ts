import { Injectable, Signal, effect, inject } from '@angular/core';
import { defaultTo } from 'lodash';
import { toObservable } from '@angular/core/rxjs-interop';
import { StorageService } from '../../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractState {

  protected _storageS = inject(StorageService);

  /* -------------------- */

  protected _store<T = any>(schema: T, key: string, options: { get: (schema: T) => any, set: (schema: T, value: any) => void }) {
    this._storageS.get(key).then(value => {
      options.set(schema, defaultTo(value, options.get(schema)));
    });

    effect(() => this._storageS.set(key, options.get(schema)));

    return schema;
  }

  protected _storeDynamicKey<T = any>(schema: T, key: Signal<string>, options: { get: (schema: T) => any, set: (schema: T, value: any) => void }) {
    toObservable(key).subscribe(async value => {
      if (value) {
        options.set(schema, defaultTo(await this._storageS.get(value), options.get(schema)));
      }
    })

    effect(() => key() ? this._storageS.set(key(), options.get(schema)) : null);

    return schema;
  }
}
