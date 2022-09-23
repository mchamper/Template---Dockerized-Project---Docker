import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthSystemUser } from "../core/auth-system-user/auth-system-user.model";
import { AbstractInterceptor } from "./abstract.interceptor";
import { AUTH_LOGIN, AUTH_STORE_KEY, AUTH_UPDATE } from "./contexts";

export interface IHttpResponse {
  body: any,
  message: string,
}

@Injectable()
export class SuccessInterceptor extends AbstractInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.resolveAuth(req);

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const res: IHttpResponse = event.body;

          if (req.context.get(AUTH_LOGIN)) {
            switch (req.context.get(AUTH_STORE_KEY)) {
              case 'authSystemUser': {

                this._storeS.set('authSystemUser', new AuthSystemUser({
                  systemUser: res.body.auth_system_user,
                  token: res.body.token,
                }), true, { emit: 'login' });

                break;
              }
            }
          }

          if (req.context.get(AUTH_UPDATE)) {
            switch (req.context.get(AUTH_STORE_KEY)) {
              case 'authSystemUser': {
                this._storeS.update('authSystemUser', new AuthSystemUser({
                  systemUser: res.body.auth_system_user,
                  token: this._storeS.authSystemUser.value?.token,
                }));

                break;
              }
            }
          }
        }
      })
    );
  }
}
