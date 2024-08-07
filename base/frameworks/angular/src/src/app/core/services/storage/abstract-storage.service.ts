import { Injectable, inject } from '@angular/core';
import { SsrService } from '../ssr.service';

export type TStoreOptions = {
  base64?: boolean,
}

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractStorageService {

  protected _ssrS = inject(SsrService);
  protected _version = 1;

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
}
