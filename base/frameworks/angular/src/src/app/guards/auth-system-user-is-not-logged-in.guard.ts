import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../services/auth.service';

export function authSystemUserIsNotLoggedInGuard(): CanActivateFn {
  return (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authS = inject(AuthService);

    const can = !authS.systemUser().isLoggedIn();

    if (!can) {
      router.navigate(['/'], {
        replaceUrl: true,
      });
    }

    return can;
  };
}
