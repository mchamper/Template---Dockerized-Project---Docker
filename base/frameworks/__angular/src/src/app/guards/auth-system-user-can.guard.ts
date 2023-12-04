import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../services/auth.service';

export function authSystemUserCanGuard(permissions: string | string[], matchAll: boolean = true): CanActivateFn {
  return (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authS = inject(AuthService);

    const can = authS.systemUser().can(permissions, matchAll);

    if (!can) {
      router.navigate(['/forbidden'], {
        replaceUrl: true,
      });
    }

    return can;
  };
}
