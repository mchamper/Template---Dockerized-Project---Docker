import { Injectable, Injector, Signal, WritableSignal, effect, inject, signal } from '@angular/core';
import { SsrService } from '../ssr.service';
import { defaultTo } from 'lodash';
import { simpleStateFactory } from '../../utils/factories/state.factory';
import { coreConfig } from '../../../configs/core.config';
import { base64DecodeTimes, base64EncodeTimes } from '../../utils/helpers/hash.helper';

const getDefaultStoreOptions = <T>() => ({
  get: (entity: T) => (entity as WritableSignal<T>)() as any,
  set: (entity: T, value: any) => (entity as WritableSignal<T>).set(value),
});

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractStorageService {

  protected _injector = inject(Injector);
  protected _ssrS = inject(SsrService);

  protected _version = 1;
  protected _data!: WritableSignal<{ [key: string]: any }>;

  state = simpleStateFactory();

  /* -------------------- */

  async init() {
    if (this._ssrS.isServer()) return;

    await this._get(''); // Warm up

    const storageVersion = await this._get('storageVersion') as number;

    if (!storageVersion || storageVersion !== this._version) {
      await this._clear();
      await this._set('storageVersion', this._version);
    }

    this._data = signal(await this._get('data') || {});

    effect(() => {
      this._set('data', this._data());
    }, { injector: this._injector });

    this.state.setReady();
  }

  /* -------------------- */

  protected abstract _get(key: string): Promise<any>
  protected abstract _set(key: string, value: any): Promise<void>
  protected abstract _remove(key: string): Promise<void>
  protected abstract _clear(): Promise<void>

  get(key: string) {
    this._checkState();
    return this._data()[key];
  }

  set(key: string, value: any) {
    this._checkState();
    this._data.update(data => ({ ...data, [key]: value }));
  }

  remove(key: string) {
    this._checkState();
    this._data.update(data => (delete data[key], data));
  }

  clear() {
    this._checkState();
    this._data.update(() => ({}));
  }

  /* -------------------- */

  private _checkState() {
    if (!this.state.ready()) {
      throw new Error('The storage is not ready to use.');
    }
  }

  protected _encodeValue(value: any) {
    value = coreConfig.storage.base64
      ? base64EncodeTimes(value, typeof coreConfig.storage.base64 === 'number' ? coreConfig.storage.base64 : 1)
      : JSON.stringify(value);

    return value;
  }

  protected _decodeValue(value: any) {
    if (value) {
      try {
        value = coreConfig.storage.base64
          ? base64DecodeTimes(value, typeof coreConfig.storage.base64 === 'number' ? coreConfig.storage.base64 : 1)
          : JSON.parse(value);
      } catch (err) {
        value = null;
      }
    }

    return value;
  }

  /* -------------------- */

  store<T = any>(entity: T, key: string | Signal<string>, options?: Partial<ReturnType<typeof getDefaultStoreOptions<T>>>) {
    const _options = {
      ...getDefaultStoreOptions<T>(),
      ...options,
    };

    if (typeof key === 'string') {
      _options.set(entity, defaultTo(this.get(key), _options.get(entity)));

      effect(() => {
        this.set(key, _options.get(entity));
      }, { injector: this._injector, allowSignalWrites: true });
    } else {
      effect(() => {
        if (key()) {
          _options.set(entity, defaultTo(this.get(key()), _options.get(entity)));
          this.set(key(), _options.get(entity));
        }
      }, { injector: this._injector, allowSignalWrites: true });
    }

    return entity;
  }
}
