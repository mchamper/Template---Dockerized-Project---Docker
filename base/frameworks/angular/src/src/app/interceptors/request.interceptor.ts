import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { FALLBACK_GUARD, GUARD } from "./contexts";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    protected _authS: AuthService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const guardContext = req.context.get(GUARD) || req.context.get(FALLBACK_GUARD);

    let headers: HttpHeaders = req.headers;
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Accept-Language', 'es');

    if (guardContext && this._authS.guard(guardContext).token()) {
      headers = headers.set('Authorization', `Bearer ${this._authS.guard(guardContext).token()}`);
    }

    return next.handle(req.clone({
      headers,
    })).pipe(
      delay(0 * 1000)
    );
  }
}
