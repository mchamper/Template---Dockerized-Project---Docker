import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../services/auth.service';

export function authSystemUserCanGuard(permissions: string | string[], matchAll: boolean = true): CanActivateFn {
  return (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router: Router = inject(Router);
    const authS: AuthService = inject(AuthService);

    const can: boolean = authS.can(permissions, matchAll);

    if (!can) {
      router.navigate(['/forbidden'], {
        replaceUrl: true,
      });
    }

    return can;
  };
}
