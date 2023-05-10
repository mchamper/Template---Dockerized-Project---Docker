import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isArray } from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { BehaviorSubject, map, Observable, skip } from 'rxjs';
import { StorageService } from './storage.service';
import { RouteService } from './route.service';

export interface IAuth {
  data: {
    id?: number,
    email?: string,
    name?: string,
    isVerified?: boolean,
    firstName?: string,
    lastName?: string,
    picture?: string,
    roles?: string[],
    permissions?: string[],
    _raw?: any,
  },
  token: string,
  tokenExpiresAt?: Moment,
}

export type TGuard = 'appClient' | 'systemUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  guardDefault: TGuard = 'systemUser';
  guards: TGuard[] = ['appClient', 'systemUser'];

  auths: { [key: string]: BehaviorSubject<IAuth | null> } = {};

  constructor(
    private _router: Router,
    private _routeS: RouteService,
    private _storageS: StorageService,
  ) {

    this.guards.forEach(guard => {
      const defaultValue = this._storageS.getSecure(`auth.${guard}`);
      const authGuard = new BehaviorSubject<IAuth | null>(defaultValue);

      authGuard.pipe(skip(1)).subscribe(value => this._storageS.setSecure(`auth.${guard}`, value));

      this.auths[guard] = authGuard;
    });
  }

  /* -------------------- */

  guard$(guard: TGuard = this.guardDefault): BehaviorSubject<IAuth | null> {
    return this.auths[guard];
  }

  /* -------------------- */

  data(guard: TGuard = this.guardDefault): IAuth['data'] | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.data;
  }
  data$(guard: TGuard = this.guardDefault): Observable<IAuth['data'] | undefined> {
    return this.guard$(guard).pipe(map(() => this.data(guard)));
  }

  raw<T = any>(guard: TGuard = this.guardDefault): T | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.data._raw;
  }
  raw$<T = any>(guard: TGuard = this.guardDefault): Observable<T | undefined> {
    return this.guard$(guard).pipe(map(() => this.raw(guard)));
  }

  /* -------------------- */

  token(guard: TGuard = this.guardDefault): IAuth['token'] | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.token;
  }
  token$(guard: TGuard = this.guardDefault): Observable<IAuth['token'] | undefined> {
    return this.guard$(guard).pipe(map(() => this.token(guard)));
  }

  tokenExpiresAt(guard: TGuard = this.guardDefault): IAuth['tokenExpiresAt'] | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.tokenExpiresAt;
  }
  tokenExpiresAt$(guard: TGuard = this.guardDefault): Observable<IAuth['tokenExpiresAt'] | undefined> {
    return this.guard$(guard).pipe(map(() => this.tokenExpiresAt(guard)));
  }

  /* -------------------- */

  isLoggedIn(guard: TGuard = this.guardDefault): boolean {
    const auth = this.guard$(guard).value;

    if (!auth?.data) {
      return false;
    }

    if (!auth?.token) {
      return false;
    }

    if (!!auth?.tokenExpiresAt && auth.tokenExpiresAt < moment()) {
      return false;
    }

    return true;
  }
  isLoggedIn$(guard: TGuard = this.guardDefault): Observable<boolean> {
    return this.guard$(guard).pipe(map(() => this.isLoggedIn(guard)));
  }

  isVerified(guard: TGuard = this.guardDefault): boolean {
    const auth = this.guard$(guard).value;
    return !!auth?.data.isVerified;
  }
  isVerified$(guard: TGuard = this.guardDefault): Observable<boolean> {
    return this.guard$(guard).pipe(map(() => this.isVerified(guard)));
  }

  /* -------------------- */

  login(auth: IAuth, guard: TGuard = this.guardDefault, cb?: () => any): void {
    this.guard$(guard).next(auth);
    if (cb) cb();
  }

  logout(guard: TGuard = this.guardDefault, cb?: () => any): void {
    if (!this.isLoggedIn(guard)) return;

    this.guard$(guard).next(null);

    switch (guard) {
      case 'appClient': {
        // window.location.reload();
        break;
      }

      case 'systemUser': {
        this._router.navigate(['/bienvenido'], {
          replaceUrl: true,
          queryParams: {
            redirectTo: `${this._routeS.currentPage$.value.url || '/'}`
          },
        });

        break;
      }
    }

    if (cb) cb();
  }

  /* -------------------- */

  hasRole(roles: string | string[], matchAll: boolean = true, guard: TGuard = this.guardDefault): boolean {
    const auth = this.guard$(guard).value;

    if (!isArray(roles)) {
      roles = [roles];
    }

    return roles[matchAll ? 'every' : 'some'](role => {
      return auth?.data.roles?.some(item => item === role) || false;
    });
  }

  can(permissions: string | string[], matchAll: boolean = true, guard: TGuard = this.guardDefault): boolean {
    const auth = this.guard$(guard).value;

    if (!isArray(permissions)) {
      permissions = [permissions];
    }

    return permissions[matchAll ? 'every' : 'some'](permission => {
      return auth?.data.permissions?.some(item => item === permission) || false;
    });
  }
}
