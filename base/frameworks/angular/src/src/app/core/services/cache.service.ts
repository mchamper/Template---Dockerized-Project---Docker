import { HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from '../../services/storage.service';

interface CacheEntry {
  value: HttpEvent<unknown>;
  expiresOn: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private _storegeS = inject(StorageService);
  private _cache!: Map<string, CacheEntry>;

  async init() {
    this._cache = new Map<string, CacheEntry>(await this._storegeS.get('httpCache'));
  }

  /* -------------------- */

  get(key: string): HttpEvent<unknown> | undefined {
    const cached = this._cache.get(key);

    if (!cached) {
      return undefined;
    }

    if (new Date().getTime() >= cached.expiresOn) {
      this._cache.delete(key);
      return undefined;
    }

    return cached.value;
  }

  set(key: string, value: HttpEvent<unknown>, ttl = 60): void {
    this._cache.set(key, {
      value,
      expiresOn: new Date().getTime() + (ttl * 1000),
    });

    this._storegeS.set('httpCache', Array.from(this._cache.entries()));
  }
}
