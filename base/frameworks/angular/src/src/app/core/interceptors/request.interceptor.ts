import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { FALLBACK_GUARD, GUARD } from "./contexts";
import { delay, Observable } from "rxjs";
import { State } from "../../states/state";
import { coreConfig } from "../../configs/core.config";

export function requestInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authS = inject(AuthService);
  const state = inject(State);

  const guardContext = req.context.get(GUARD) || req.context.get(FALLBACK_GUARD);

  let headers: HttpHeaders = req.headers;
  headers = headers.set('Accept', 'application/json');
  headers = headers.set('Accept-Language', state.lang());

  for (let key in coreConfig.http.headers) {
    headers = headers.set(key, coreConfig.http.headers[key]);
  }

  if (guardContext && authS.guard(guardContext).activeSession()?.token) {
    headers = headers.set('Authorization', `Bearer ${authS.guard(guardContext).activeSession()!.token}`);
  }

  return next(req.clone({
    headers,
  })).pipe(
    delay(coreConfig.http.delay || 0)
  );
}
