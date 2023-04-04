import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { get } from "lodash";
import { map, Observable } from "rxjs";
import { AuthService, TGuard } from "../services/auth.service";
import { AUTH_GUARD, AUTH_LOGIN, AUTH_LOGIN_GUARD, AUTH_LOGOUT, AUTH_UPDATE, AUTH_UPDATE_GUARD, RES, RES_MAP, URL } from "./contexts";

export interface IHttpResponse<T1 = any, T2 = any> {
  status: number,
  message: string,
  body: T1,
  bodyMapped?: T2,
}

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {

  constructor(
    protected _authS: AuthService,
  ) { }

  /* -------------------- */

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let guard: TGuard | null = req.context.get(AUTH_GUARD);

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const resBody = event.body;

          let res: IHttpResponse = {
            status: typeof resBody?.status !== 'undefined' ? resBody?.status : event.status,
            message: typeof resBody?.message !== 'undefined' ? resBody?.message : event.statusText,
            body: typeof resBody?.body !== 'undefined' ? resBody?.body : event.body,
          }

          const urlContext = req.context.get(URL);
          const resContext = req.context.get(RES);
          const resMapContext = req.context.get(RES_MAP);

          if (resContext) {
            res = {
              ...res,
              message: resContext.message ? get(event.body, resContext.message) : res.message,
              body: resContext.body ? get(event.body, resContext.body) : res.body,
            };
          }
          else if (urlContext === 'backend') {
            res = {
              ...res
            };
          }

          if (resMapContext) {
            res.bodyMapped = resMapContext(res);
          }

          if (guard) {
            if (req.context.get(AUTH_LOGOUT)) {
              this._authS.logout(guard);
            }

            const authLoginContext = req.context.get(AUTH_LOGIN);
            const authUpdateContext = req.context.get(AUTH_UPDATE);
            const authLoginGuard: TGuard | null = req.context.get(AUTH_LOGIN_GUARD);
            const authUpdateGuard: TGuard | null = req.context.get(AUTH_UPDATE_GUARD);

            if (authLoginGuard) guard = authLoginGuard;
            if (authUpdateGuard) guard = authUpdateGuard;

            if (authLoginContext) {
              this._authS.login(authLoginContext(res), guard);
            }
            else if (authUpdateContext) {
              const auth = this._authS.guard$(guard).value;

              if (auth) {
                this._authS.login({
                  ...auth,
                  data: {
                    ...auth.data,
                    ...authUpdateContext(res),
                  },
                }, guard);
              }
            }
          }

          event = event.clone({ body: res });
        }

        return event;
      })
    );
  }
}
