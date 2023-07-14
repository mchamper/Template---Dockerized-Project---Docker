import { Injectable, WritableSignal, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { isArray } from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { RouteService } from './route.service';
import { SystemUser } from '../commons/models/system-user';

export type TGuard =
  | 'guest'
  | 'appClient'
  | 'systemUser'
  | 'user'
  ;

export interface IAuth<DataModel = any> {
  token: string,
  tokenExpiresAt?: Moment,
  data?: {
    id?: number,
    name?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    isVerified?: boolean,
    picture?: string,
    roles?: string[],
    permissions?: string[],
    model?: DataModel,
  },
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  guards: TGuard[] = [
    'guest',
    'appClient',
    'systemUser',
    'user',
  ];

  auths: {
    [key: string]: WritableSignal<IAuth | null>
  } = {};

  constructor(
    private _storageS: StorageService,
    private _router: Router,
    private _routeS: RouteService,
  ) {

    this.guards.forEach(guard => {
      const defaultValue: IAuth | null = this._storageS.getSecure(`auth.${guard}`);

      if (defaultValue?.data?.model) {
        switch (guard) {
          case 'systemUser': defaultValue.data.model = new SystemUser(defaultValue?.data?.model); break;

          default: break;
        }
      }

      const auth = signal<IAuth | null>(defaultValue);
      toObservable(auth).subscribe(value => this._storageS.setSecure(`auth.${guard}`, value));

      this.auths[guard] = auth;
    });
  }

  /* -------------------- */

  private _guard<DataModel = any>(guard: TGuard): WritableSignal<IAuth<DataModel> | null> {
    return this.auths[guard];
  }

  guard<DataModel = any>(guard: TGuard) {
    const auth = this._guard<DataModel>(guard);

    return {
      guard: () => {
        return auth;
      },

      /* -------------------- */

      token: (): IAuth['token'] | undefined => {
        return auth()?.token;
      },

      tokenExpiresAt: (): IAuth['tokenExpiresAt'] | undefined => {
        return auth()?.tokenExpiresAt;
      },

      data: (): IAuth<DataModel>['data'] | undefined => {
        return auth()?.data;
      },

      model: (): DataModel | undefined => {
        return auth()?.data?.model;
      },

      /* -------------------- */

      isLoggedIn: (): boolean => {
        if (!auth()?.token) {
          return false;
        }

        const tokenExpiresAt = auth()?.tokenExpiresAt;

        if (!!tokenExpiresAt && tokenExpiresAt < moment()) {
          return false;
        }

        return true;
      },

      isVerified: (): boolean => {
        return !!auth()?.data?.isVerified;
      },

      /* -------------------- */

      login: (value: IAuth): void => {
        auth.set(value);
      },

      logout: (): void => {
        if (!this.guard(guard).isLoggedIn()) return;

        auth.set(null);

        switch (guard) {
          case 'appClient': {
            // window.location.reload();
            break;
          }

          case 'systemUser': {
            this._router.navigate(['/bienvenido'], {
              replaceUrl: true,
              queryParams: {
                redirectTo: `${this._routeS.currentPage().url || '/'}`
              },
            });

            break;
          }
        }
      },

      /* -------------------- */

      hasRole: (roles: string | string[], matchAll: boolean = true): boolean => {
        if (!isArray(roles)) roles = [roles];
        return roles[matchAll ? 'every' : 'some'](role => auth()?.data?.roles?.includes(role));
      },

      can: (permissions: string | string[], matchAll: boolean = true): boolean => {
        if (!isArray(permissions)) permissions = [permissions];
        return permissions[matchAll ? 'every' : 'some'](permission => auth()?.data?.permissions?.includes(permission));
      }
    };
  }

  /* -------------------- */

  guest() {
    return this.guard<any>('guest');
  }

  appClient() {
    return this.guard<any>('appClient');
  }

  systemUser() {
    return this.guard<SystemUser>('systemUser');
  }

  user() {
    return this.guard<any>('user');
  }
}
