import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSystemUserIsLoggedInGuard implements CanActivate {

  constructor(
    private _authS: AuthService,
    private _router: Router,
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

    const can: boolean = this._authS.isLoggedIn();

    if (!can) {
      this._router.navigate(['/bienvenido'], {
        replaceUrl: true,
        queryParams: {
          redirectTo: `${state.url}`
        },
      });
    }

    return can;
  }
}
