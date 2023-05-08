import { HttpContext, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService, TGuard } from "../services/auth.service";
import { AUTH_GUARD, URL, URL_ORIGINAL } from "./contexts";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    protected _authS: AuthService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const guard: TGuard | null = req.context.get(AUTH_GUARD);

    let headers: HttpHeaders = req.headers;

    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Accept-Language', 'es');

    if (guard && this._authS.token(guard)) {
      headers = headers.set('Authorization', `Bearer ${this._authS.token(guard)}`);
    }

    let url: string = req.url;
    let context: HttpContext = req.context;

    context = context.set(URL_ORIGINAL, url);

    if (req.url.startsWith('backend:')) {
      url = environment.backendUrl + req.url.replace('backend:', '');
      context = req.context.set(URL, 'backend');
    }

    return next.handle(req.clone({
      url,
      headers,
      context,
    })).pipe(
      delay(0 * 1000)
    );
  }
}
