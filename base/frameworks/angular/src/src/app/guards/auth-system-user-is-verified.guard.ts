import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../services/auth.service';

export function authSystemUserIsVerifiedGuard(): CanActivateFn {
  return (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router: Router = inject(Router);
    const authS: AuthService = inject(AuthService);

    const can: boolean = authS.isVerified();

    if (!can) {
      router.navigate(['/cuenta'], {
        replaceUrl: true,
      });
    }

    return can;
  };
}
