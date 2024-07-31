import { Injectable, Injector, Signal, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { AppService } from './app.service';
import { AbstractModel } from '../models/abstract.model';
import moment, { Moment } from 'moment';
import { StorageService } from '../../services/storage.service';

export type TAuthGuardName = keyof AbstractAuthService['_guards'];

export type TAuthGuardRawSession<DataModel = any> = {
  token: string,
  refreshToken: string,
  tokenExpiresAt?: Moment,
  data?: {
    id?: number,
    name?: string,
    firstName?: string,
    lastName?: string,
    fullName?: string,
    phone?: string,
    email?: string,
    isVerified?: boolean,
    picture?: string,
    roles?: string[],
    permissions?: string[],
    model?: DataModel,
  },
};

type TAuthGuardSession<DataModel = any> = TAuthGuardRawSession<DataModel> & {
  isActive: boolean,
  tokenHasExpired: () => boolean,
  isVerified: () => boolean,
  hasRole: (roles: string[], matchAll?: boolean) => boolean,
  can: (permissions: string[], matchAll?: boolean) => boolean,
};

type TAuthGuard<DataModel = any> = {
  sessions: WritableSignal<TAuthGuardSession<DataModel>[]>,
  activeSession: Signal<TAuthGuardSession<DataModel> | undefined>,
  activeSessionIndex: Signal<number>,
  addSession: (value: TAuthGuardRawSession, mustReload?: boolean) => void,
  updateSession: (value: Partial<TAuthGuardRawSession>) => void,
  removeSession: (mustReload?: boolean) => void,
  removeSessionAt: (index: number, mustReload?: boolean) => void,
  removeAllSessions: (mustReload?: boolean) => void,
  selectSession: (index: number, mustReload?: boolean) => void,
  initEffect: () => void,
};

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractAuthService {

  protected _injector = inject(Injector);
  private _appS = inject(AppService);
  private _storageS = inject(StorageService);

  private _guards: {
    appClient?: TAuthGuard,
    guest?: TAuthGuard,
    systemUser?: TAuthGuard,
    user?: TAuthGuard,
  } = {};

  /* -------------------- */

  protected async _init(guardsConfig: TAuthGuardName[] | { guard: TAuthGuardName, modelClass?: any }[]): Promise<void> {
    for (const config of guardsConfig) {
      typeof config === 'string'
        ? this._guards[config] = await this._createGuard(config)
        : this._guards[config.guard] = await this._createGuard(config.guard, config.modelClass);
    }

    this.initEffects();
  }

  /* -------------------- */

  initEffects() {
    for (const key of Object.keys(this._guards)) {
      const guard = this.guard(key as TAuthGuardName);

      if (guard) {
        guard.initEffect();
      }
    }
  }

  /* -------------------- */

  guard<DataModel = any>(guardName: TAuthGuardName): TAuthGuard<DataModel> {
    return this._guards[guardName]!;
  }
  /* -------------------- */
  guest() {
    return this.guard<any>('guest');
  }
  user() {
    return this.guard<any>('user');
  }
  systemUser() {
    return this.guard<any>('systemUser');
  }
  /* -------------------- */
  guestId() {
    return this.guest()?.activeSession()?.data?.id;
  }
  userId() {
    return this.user()?.activeSession()?.data?.id;
  }
  systemUserId() {
    return this.systemUser()?.activeSession()?.data?.id;
  }
  /* -------------------- */
  guestCheck() {
    return !!this.guest()?.activeSession();
  }
  userCheck() {
    return !!this.user()?.activeSession();
  }
  systemUserCheck() {
    return !!this.systemUser()?.activeSession();
  }

  /* -------------------- */

  private async _createGuard(guardName: TAuthGuardName, modelClass?: any): Promise<TAuthGuard> {
    const storedSessions: TAuthGuardSession[] = ((await this._storageS.get(`auth.${guardName}.sessions`)) || [])
      .map((rawSession: TAuthGuardRawSession) => {
        const session = this._createSession(rawSession);

        if (modelClass && session.data?.model) {
          session.data.model = new modelClass(session.data?.model);
        }

        return session;
      });

    const sessions = signal(storedSessions);
    const activeSession = computed(() => sessions().find(session => session.isActive));
    const activeSessionIndex = computed(() => sessions().findIndex(session => session.isActive));

    const addSession = (value: TAuthGuardRawSession, mustReload: boolean = false) => {
      sessions.update(sessions => {
        return [
          ...sessions,
          this._createSession(value),
        ];
      });

      selectSession(sessions().length - 1, mustReload);
    };

    const updateSession = (value: Partial<TAuthGuardRawSession>) => {
      sessions.update(sessions => {
        return sessions.map((session, sessionIndex) => {
          if (sessionIndex === activeSessionIndex()) {
            return this._createSession({
              ...session,
              ...value,
              data: {
                ...session.data,
                ...value.data,
              }
            });
          }

          return session;
        });
      });
    };

    const removeSession = (mustReload: boolean = true) => {
      sessions.update(sessions => {
        return sessions.filter((session, sessionIndex) => sessionIndex !== activeSessionIndex());
      });

      selectSession(-1, mustReload);
    };

    const removeSessionAt = (index: number, mustReload: boolean = true) => {
      sessions.update(sessions => {
        return sessions.filter((session, sessionIndex) => sessionIndex !== index);
      });

      selectSession(-1, mustReload);
    };

    const removeAllSessions = (mustReload: boolean = true) => {
      sessions.update(sessions => {
        return [];
      });

      selectSession(-1, mustReload);
    };

    const selectSession = (index: number, mustReload: boolean = true) => {
      sessions.update(sessions => {
        return sessions.map((session, sessionIndex) => {
          return {
            ...session,
            isActive: sessionIndex === index ? true : false,
          };
        });
      });

      if (mustReload) this._appS.reload();
    };

    const initEffect = () => {
      effect(() => {
        this._storageS.set(`auth.${guardName}.sessions`, sessions().map(session => {
          if (session.data?.model instanceof AbstractModel) {
            return {
              ...session,
              data: {
                ...session.data,
                model: session.data.model.r()
              }
            };
          }

          return session;
        }));
      }, { injector: this._injector });
    }

    return {
      sessions,
      activeSession,
      activeSessionIndex,
      addSession,
      updateSession,
      removeSession,
      removeSessionAt,
      removeAllSessions,
      selectSession,
      initEffect,
    };
  };

  private _createSession(rawSession: TAuthGuardRawSession): TAuthGuardSession {
    const tokenHasExpired = () => !!rawSession.tokenExpiresAt && rawSession.tokenExpiresAt! < moment();
    const isVerified = () => !!rawSession.data?.isVerified;

    const hasRole = (roles: string[], matchAll: boolean = false): boolean => {
      return roles[matchAll ? 'every' : 'some'](role => rawSession.data?.roles?.includes(role));
    };

    const can = (permissions: string[], matchAll: boolean = false): boolean => {
      return permissions[matchAll ? 'every' : 'some'](permission => rawSession.data?.permissions?.includes(permission));
    };

    return {
      isActive: false,
      ...rawSession,
      tokenHasExpired,
      isVerified,
      hasRole,
      can,
    };
  }
}
