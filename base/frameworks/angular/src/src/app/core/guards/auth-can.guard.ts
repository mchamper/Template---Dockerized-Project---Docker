import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { TAuthGuardName } from "../services/abstract-auth.service";
import { AuthService } from "../../services/auth.service";
import { TRouteData } from "../types/route-data.type";

export function authCanGuard(guardName: TAuthGuardName, matchAll: boolean = true): CanActivateFn {
  return (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authS = inject(AuthService);

    const permissions = (next.data as TRouteData).permissions || [];

    const can = !!authS.guard(guardName).activeSession()?.can(permissions, matchAll);

    if (!can) {
      router.navigate(['/forbidden'], {
        replaceUrl: false,
      });
    }

    return can;
  };
}
