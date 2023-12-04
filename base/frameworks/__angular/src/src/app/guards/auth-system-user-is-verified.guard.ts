import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../services/auth.service';

export function authSystemUserIsVerifiedGuard(): CanActivateFn {
  return (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authS = inject(AuthService);

    const can = authS.systemUser().isVerified();

    if (!can) {
      router.navigate(['/cuenta'], {
        replaceUrl: true,
      });
    }

    return can;
  };
}
