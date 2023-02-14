import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, skip } from 'rxjs';
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

export type TGuard = 'client' | 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  guards: TGuard[] = ['client', 'user'];
  auths: { [key: string]: BehaviorSubject<IAuth | null> } = {};

  constructor(
    private _router: Router,
    private _storageS: StorageService
  ) {

    this.guards.forEach(guard => {
      const defaultValue = this._storageS.getSecure(`auth.${guard}`);
      const authGuard = new BehaviorSubject<IAuth | null>(defaultValue);

      authGuard.pipe(skip(1)).subscribe(value => this._storageS.setSecure(`auth.${guard}`, value));

      this.auths[guard] = authGuard;
    });
  }

  /* -------------------- */

  guard$(guard: TGuard = 'user'): BehaviorSubject<IAuth | null> {
    return this.auths[guard];
  }

  /* -------------------- */

  data<T>(guard: TGuard = 'user'): T | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.data;
  }
  data$<T>(guard: TGuard = 'user'): Observable<T | undefined> {
    return this.guard$(guard).pipe(map(() => this.data(guard)));
  }

  token(guard: TGuard = 'user'): string | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.token;
  }
  token$(guard: TGuard = 'user'): Observable<string | undefined> {
    return this.guard$(guard).pipe(map(() => this.token(guard)));
  }

  tokenExpiresAt(guard: TGuard = 'user'): Date | undefined {
    if (!this.isLoggedIn(guard)) return;
    return this.guard$(guard).value?.tokenExpiresAt;
  }
  tokenExpiresAt$(guard: TGuard = 'user'): Observable<Date | undefined> {
    return this.guard$(guard).pipe(map(() => this.tokenExpiresAt(guard)));
  }

  /* -------------------- */

  isLoggedIn(guard: TGuard = 'user'): boolean {
    const auth = this.guard$(guard).value;

    return !!auth?.data
      && (
        !auth.token
        || !auth.tokenExpiresAt
        || auth.tokenExpiresAt < new Date()
      );
  }
  isLoggedIn$(guard: TGuard = 'user'): Observable<boolean> {
    return this.guard$(guard).pipe(map(() => this.isLoggedIn(guard)));
  }

  /* -------------------- */

  login(auth: IAuth, guard: TGuard = 'user'): void {
    this.guard$(guard).next(auth);
  }

  logout(guard: TGuard = 'user'): void {
    this.guard$(guard).next(null);

    switch (guard) {
      case 'user': {
        this._router.navigateByUrl('/', { replaceUrl: true }); break;
      }
    }
  }
}
