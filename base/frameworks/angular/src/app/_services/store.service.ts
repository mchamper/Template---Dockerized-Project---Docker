/** version: 1 */

import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { factory } from '../commons/factory';
import { AuthSystemUser } from '../core/auth-system-user/auth-system-user.model';

export type StoreKey =
    '_'
  | 'authSystemUser'
  | 'collapseFilters'
  | 'httpCache'
  ;

export type EmitReason =
    'login'
  | 'logout'
  ;

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _prefix = 'app.';

  event: EventEmitter<{
    concept: StoreKey,
    reason: EmitReason,
    is: (compareKey: StoreKey, compareReasons: EmitReason[]) => boolean
  }> = new EventEmitter();

  _: BehaviorSubject<any> = new BehaviorSubject(
    this._hasInStorage('_')
      ? this._getFromStorage('_').value
      : null
  );

  authSystemUser: BehaviorSubject<AuthSystemUser | null> = new BehaviorSubject(
    this._hasInStorage('authSystemUser')
      ? factory.create(this._getFromStorage('authSystemUser').value, AuthSystemUser)
      : null
  );

  collapseFilters: BehaviorSubject<boolean> = new BehaviorSubject(
    this._hasInStorage('collapseFilters')
      ? this._getFromStorage('collapseFilters').value
      : false
  );

  httpCache: BehaviorSubject<any> = new BehaviorSubject(
    this._hasInStorage('httpCache')
      ? this._getFromStorage('httpCache').value
      : null
  );

  constructor(
    private _ssrS: SsrService,
  ) { }

  /* -------------------- */

  private _hasInStorage(key: StoreKey): boolean {
    const res = this._getFromStorage(key);

    if (res) {
      if (!res.expiresAt) {
        return true;
      }

      const now = new Date();
      const expiresAt = new Date(res.expires_at);

      if (now >= expiresAt) {
        this._removeFromStorage(key);
        return false;
      }

      return true;
    }

    return false;
  }

  private _getFromStorage(key: StoreKey): any {
    if (this._ssrS.isServer()) return;

    const value = localStorage.getItem(`${this._prefix}${key}`);

    return !!value
      ? JSON.parse(value)
      : null;
  }

  private _removeFromStorage(key: StoreKey): void {
    if (this._ssrS.isServer()) return;
    localStorage.removeItem(`${this._prefix}${key}`);
  }

  /* -------------------- */

  emit(key: StoreKey, reason: EmitReason): void {
    this.event.emit({
      concept: key,
      reason: reason,
      is: (compareKey: StoreKey, compareReasons: EmitReason[]) => {
        return compareKey === key && compareReasons.includes(reason);
      }
    });
  }

  /* -------------------- */

  get(key: StoreKey): any {
    return this[key].value;
  }

  set(key: StoreKey, value: any, inLocalStorage: boolean = false, options?: { expiresIn?: number, emit?: EmitReason }): void {
    if (inLocalStorage && this._ssrS.isBrowser()) {
      let now = new Date();

      if (options?.expiresIn) {
        now.setMinutes(now.getMinutes() + options?.expiresIn);
      }

      localStorage.setItem(`${this._prefix}${key}`, JSON.stringify({
        value,
        expires_at: options?.expiresIn ? now.toISOString() : null,
      }));
    }

    this[key].next(value);

    if (options?.emit) {
      this.emit(key, options?.emit);
    }
  }

  update(key: StoreKey, value: any, options?: { emit?: EmitReason }): void {
    if (this._hasInStorage(key) && this._ssrS.isBrowser()) {
      let data = this._getFromStorage(key);

      localStorage.setItem(`${this._prefix}${key}`, JSON.stringify({
        value,
        expires_at: data.expires_at || null,
      }));
    }

    this[key].next(value);

    if (options?.emit) {
      this.emit(key, options?.emit);
    }
  }

  remove(key: StoreKey, options?: { emit?: EmitReason }): void {
    if (this._hasInStorage(key)) {
      this._removeFromStorage(key);
    }

    this[key].next(null);

    if (options?.emit) {
      this.emit(key, options?.emit);
    }
  }
}
