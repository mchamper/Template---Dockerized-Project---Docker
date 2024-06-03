import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export type TStoreOptions = {
  base64?: boolean,
}

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractStorageService {

  async init() {
    const storageVersion = await this.get('storageVersion') as number;

    if (!storageVersion || storageVersion !== environment.storageVersion) {
      await this.clear();
      await this.set('storageVersion', environment.storageVersion);
    }
  }

  /* -------------------- */

  abstract get(key: string): Promise<any>
  abstract set(key: string, value: any): Promise<void>
  abstract remove(key: string): Promise<void>
  abstract clear(): Promise<void>
}
