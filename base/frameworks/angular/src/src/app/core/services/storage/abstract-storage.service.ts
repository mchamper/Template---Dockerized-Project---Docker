import { Injectable, Injector, Signal, WritableSignal, effect, inject } from '@angular/core';
import { SsrService } from '../ssr.service';
import { defaultTo } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractStorageService {

  protected _injector = inject(Injector);
  protected _ssrS = inject(SsrService);
  protected _version = 1;

  private _getDefaultStoreOptions = <T>() => ({
    get: (entity: T) => (entity as WritableSignal<T>)() as any,
    set: (entity: T, value: any) => (entity as WritableSignal<T>).set(value),
  });

  /* -------------------- */

  private async _warmUp() {
    if (this._ssrS.isServer()) return;
    await this.get('');
  }

  async init() {
    if (this._ssrS.isServer()) return;

    await this._warmUp();

    const storageVersion = await this.get('storageVersion') as number;

    if (!storageVersion || storageVersion !== this._version) {
      await this.clear();
      await this.set('storageVersion', this._version);
    }
  }

  /* -------------------- */

  abstract get(key: string): Promise<any>
  abstract set(key: string, value: any): Promise<void>
  abstract remove(key: string): Promise<void>
  abstract clear(): Promise<void>

  /* -------------------- */

  store<T = any>(entity: T, key: string, options?: Partial<ReturnType<typeof this._getDefaultStoreOptions<T>>>) {
    const _options = {
      ...this._getDefaultStoreOptions<T>(),
      ...options,
    };

    this.get(key).then(storedValue => {
      _options.set(entity, defaultTo(storedValue, _options.get(entity)));
    });

    effect(() => {
      this.set(key, _options.get(entity));
    }, { injector: this._injector });

    return entity;
  }

  storeDynamicKey<T = any>(entity: T, key: Signal<string>, options?: Partial<ReturnType<typeof this._getDefaultStoreOptions<T>>>) {
    const _options = {
      ...this._getDefaultStoreOptions<T>(),
      ...options,
    };

    effect(async () => {
      if (key()) {
        _options.set(entity, defaultTo(await this.get(key()), _options.get(entity)));
        this.set(key(), _options.get(entity));
      }
    }, { injector: this._injector });

    return entity;
  }
}
