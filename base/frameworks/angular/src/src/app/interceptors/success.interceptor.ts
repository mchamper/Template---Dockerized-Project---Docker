import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { get } from "lodash";
import { map, Observable } from "rxjs";
import { AuthService, TGuard } from "../services/auth.service";
import { AUTH_GUARD, AUTH_LOGIN, AUTH_UPDATE, RES, RES_MAP, URL } from "./contexts";

export interface IHttpResponse<T1 = any, T2 = any> {
  body: T1,
  message: string,
  status: number,
  bodyMapped?: T2,
}

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {

  constructor(
    protected _authS: AuthService,
  ) { }

  /* -------------------- */

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const guard: TGuard | null = req.context.get(AUTH_GUARD);

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          let res: IHttpResponse = {
            body: event.body,
            message: event.statusText,
            status: event.status,
          };

          const urlContext = req.context.get(URL);
          const resContext = req.context.get(RES);
          const resMapContext = req.context.get(RES_MAP);

          if (resContext) {
            res = {
              ...res,
              body: resContext.body ? get(event.body, resContext.body) : res.body,
              message: resContext.message ? get(event.body, resContext.message) : res.message,
            };
          }
          else if (urlContext === 'api') {
            res = {
              ...res,
              body: event.body?.payload,
              message: event.body?.message || res.message,
            };
          }
          else if (urlContext === 'backend') {
            res = {
              ...res,
              body: event.body?.body,
              message: event.body?.message || res.message,
            };
          }

          if (resMapContext) {
            res.bodyMapped = resMapContext(res);
          }

          if (guard) {
            const authLoginPaths = req.context.get(AUTH_LOGIN);
            const authUpdatePaths = req.context.get(AUTH_UPDATE);

            if (authLoginPaths) {
              this._authS.login({
                data: get(res.bodyMapped || res.body, authLoginPaths?.data || '') || null,
                token: get(res.bodyMapped || res.body, authLoginPaths?.token || '') || null,
                tokenExpiresAt: get(res.bodyMapped || res.body, authLoginPaths?.tokenExpiresAt || '') || null,
              });
            }
            else if (authUpdatePaths) {
              this._authS.login({
                data: get(res.bodyMapped || res.body, authUpdatePaths?.data || '') || this._authS.guard$(guard).value?.data || null,
                token: get(res.bodyMapped || res.body, authUpdatePaths?.token || '') || this._authS.guard$(guard).value?.token || null,
                tokenExpiresAt: get(res.bodyMapped || res.body, authUpdatePaths?.tokenExpiresAt || '') || this._authS.guard$(guard).value?.tokenExpiresAt || null,
              });
            }
          }

          event = event.clone({ body: res });
        }

        return event;
      })
    );
  }
}
