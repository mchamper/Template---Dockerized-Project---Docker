import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { TAuthGuardName } from "../services/abstract-auth.service";
import { AuthService } from "../../services/auth.service";

export function authIsVerifiedGuard(guardName: TAuthGuardName): CanActivateFn {
  return (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authS = inject(AuthService);

    const can = !!authS.guard(guardName).activeSession()?.isVerified();

    if (!can) {
      router.navigate(['/cuenta'], {
        replaceUrl: false,
      });
    }

    return can;
  };
}
