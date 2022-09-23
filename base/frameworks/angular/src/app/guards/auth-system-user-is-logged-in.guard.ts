import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavService } from '../services/nav.service';
import { StoreService } from '../services/store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserIsLoggedInGuard implements CanActivate {

  constructor(
    private _storeS: StoreService,
    private _navS: NavService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.resolveCanActivate(next, state);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.resolveCanActivate(next, state);
  }

  /* -------------------- */

  resolveCanActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const can: boolean = this._storeS.authSystemUser.value?.isLoggedIn() || false;

    if (!can) {
      this._navS.pages.AuthLoginPage.nav();
    }

    return can;
  }
}
