import { SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, skip } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

export interface IAuthLoginContext {
  data: string,
  token?: string,
  tokenExpiresAt?: string,
}

export interface IAuth {
  data: any,
  token?: string,
  tokenExpiresAt?: Date,
}

export type TGuard = 'local' | 'client' | 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  guardDefault: TGuard = environment.authGuard;
  guards: TGuard[] = ['local', 'user'];

  auths: { [key: string]: BehaviorSubject<IAuth | null> } = {};

  constructor(
    private _router: Router,
    private _storageS: StorageService,
  ) {

    this.guards.forEach(guard => {
      let authGuard;

      if (guard === 'local') {
        authGuard = new BehaviorSubject<IAuth | null>(null);
      } else {
        const defaultValue = this._storageS.getSecure(`auth.${guard}`);
        authGuard = new BehaviorSubject<IAuth | null>(defaultValue);

        authGuard.pipe(skip(1)).subscribe(value => this._storageS.setSecure(`auth.${guard}`, value));
      }

      this.auths[guard] = authGuard;
    });
  }

  /* -------------------- */

  guard$(guard: TGuard = this.guardDefault): BehaviorSubject<IAuth | null> {
    return this.auths[guard];
  }

  /* -------------------- */

  data<T = any>(guard: TGuard = this.guardDefault): T | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.data;
  }
  data$<T = any>(guard: TGuard = this.guardDefault): Observable<T | undefined> {
    return this.guard$(guard).pipe(map(() => this.data<T>(guard)));
  }

  socialData(guard: TGuard = this.guardDefault): SocialUser | undefined {
    return this.data<SocialUser>(guard);
  }
  socialData$(guard: TGuard = this.guardDefault): Observable<SocialUser | undefined> {
    return this.data$<SocialUser>(guard);
  }

  /* -------------------- */

  token(guard: TGuard = this.guardDefault): string | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.token;
  }
  token$(guard: TGuard = this.guardDefault): Observable<string | undefined> {
    return this.guard$(guard).pipe(map(() => this.token(guard)));
  }

  tokenExpiresAt(guard: TGuard = this.guardDefault): Date | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.tokenExpiresAt;
  }
  tokenExpiresAt$(guard: TGuard = this.guardDefault): Observable<Date | undefined> {
    return this.guard$(guard).pipe(map(() => this.tokenExpiresAt(guard)));
  }

  /* -------------------- */

  isLoggedIn(guard: TGuard = this.guardDefault): boolean {
    const auth = this.guard$(guard).value;

    return !!auth?.data
      && (
        !auth.token
        || !auth.tokenExpiresAt
        || auth.tokenExpiresAt < new Date()
      );
  }
  isLoggedIn$(guard: TGuard = this.guardDefault): Observable<boolean> {
    return this.guard$(guard).pipe(map(() => this.isLoggedIn(guard)));
  }

  /* -------------------- */

  login(auth: IAuth, guard: TGuard = this.guardDefault, cb?: () => any): void {
    this.guard$(guard).next(auth);

    if (cb) {
      cb();
    }
  }

  logout(guard: TGuard = this.guardDefault): void {
    this.guard$(guard).next(null);

    switch (guard) {
      case 'local':
      case 'user': {
        this._router.navigateByUrl('/ingresar', { replaceUrl: true }); break;
      }
    }
  }
}
