import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import * as CryptoJS from  'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _cryptoKey: string = `qwerty.${environment.storageVersion}`;

  constructor(
    public localStorage: LocalStorageService,
    public sessionStorage: SessionStorageService,
  ) { }

  /* -------------------- */

  get(key: string, options?: { session?: boolean, encrypt?: boolean }): any {
    let value = options?.session
      ? this.sessionStorage.retrieve(key)
      : this.localStorage.retrieve(key);

    if (value) {
      if (options?.encrypt) {
        value = this._decrypt(value);
      }

      value = JSON.parse(value);
    }

    return value;
  }
  getSession(key: string): any {
    return this.get(key, { session: true });
  }

  getSecure(key: string): any {
    return this.get(key, { encrypt: true });
  }
  getSecureSession(key: string): any {
    return this.get(key, { session: true, encrypt: true });
  }

  set(key: string, value: any, options?: { session?: boolean, encrypt?: boolean }): void {
    value = JSON.stringify(value);

    if (options?.encrypt) {
      value = this._encrypt(value);
    }

    options?.session
      ? this.sessionStorage.store(key, value)
      : this.localStorage.store(key, value);
  }
  setSession(key: string, value: any): void {
    return this.set(key, value, { session: true });
  }

  setSecure(key: string, value: any,): any {
    return this.set(key, value, { encrypt: true });
  }
  setSecureSession(key: string, value: any): void {
    return this.set(key, value, { session: true, encrypt: true });
  }

  clear(key?: string, options?: { session?: boolean }): void {
    options?.session
      ? this.sessionStorage.clear(key)
      : this.localStorage.clear(key);
  }
  clearSession(key?: string): void {
    this.clear(key, { session: true });
  }

  /* -------------------- */

  private _encrypt(value: any): string {
    return CryptoJS.AES.encrypt(value, this._cryptoKey).toString();
  }

  private _decrypt(value: string) {
    return CryptoJS.AES.decrypt(value, this._cryptoKey).toString(CryptoJS.enc.Utf8);
  }
}
