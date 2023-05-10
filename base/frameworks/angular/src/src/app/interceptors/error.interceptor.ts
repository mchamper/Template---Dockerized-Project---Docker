import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { get } from "lodash";
import { catchError, Observable, of, tap, throwError } from "rxjs";
import { AuthService, TGuard } from "../services/auth.service";
import { AUTH_GUARD, AUTH_LOGIN_GUARD, AUTH_LOGOUT_ON_ERROR, AUTH_UPDATE_GUARD, ERR, ERR_AS_200, URL } from "./contexts";

export interface IHttpErrorResponse {
  status: number,
  message: string,
  body: any,
  name: string,
  exception: string,
  code: number,
  validation: any,
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    protected _authS: AuthService,
  ) { }

  /* -------------------- */

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let guard: TGuard | null = req.context.get(AUTH_GUARD);

    return next.handle(req).pipe(
      catchError((event: HttpEvent<any>) => {
        if (event instanceof HttpErrorResponse) {
          const resError = event.error;

          let error: IHttpErrorResponse = {
            status: typeof resError?.status !== 'undefined' ? resError?.status : event.status,
            message: typeof resError?.message !== 'undefined' ? resError?.message : event.statusText,
            body: typeof resError?.body !== 'undefined' ? resError?.body : null,
            name: typeof resError?.name !== 'undefined' ? resError?.name : 'UNKNOWN_ERROR',
            exception: typeof resError?.exception !== 'undefined' ? resError?.exception : '',
            code: typeof resError?.code !== 'undefined' ? resError?.code : -1,
            validation: typeof resError?.validation !== 'undefined' ? resError?.validation : null,
          }

          const urlContext = req.context.get(URL);
          const errContext = req.context.get(ERR);
          const errAs200Context = req.context.get(ERR_AS_200);

          if (errContext) {
            error = {
              ...error,
              message: errContext.message ? get(event.error, errContext.message) : error.message,
              body: errContext.body ? get(event.error, errContext.body) : error.body,
              validation: errContext.validation ? get(event.error, errContext.validation) : error.validation,
            };
          }
          else if (urlContext === 'backend') {
            error = {
              ...error,
            };
          }

          if (guard) {
            const authLoginGuard: TGuard | null = req.context.get(AUTH_LOGIN_GUARD);
            const authUpdateGuard: TGuard | null = req.context.get(AUTH_UPDATE_GUARD);

            if (error.status === 401 && error.exception === 'AuthenticationException') {
              if (authLoginGuard) this._authS.logout(authLoginGuard);
              else if (authUpdateGuard) this._authS.logout(authUpdateGuard);
              else this._authS.logout(guard);
            }

            if (req.context.get(AUTH_LOGOUT_ON_ERROR)) {
              this._authS.logout(guard);
            }
          }

          if (errAs200Context && errAs200Context(error)) {
            return of(new HttpResponse({
              status: 200,
              statusText: error.message,
              body: error.body,
            }));
          }

          return throwError(() => error);
        }

        return throwError(() => event);
      }),
    );
  }
}
