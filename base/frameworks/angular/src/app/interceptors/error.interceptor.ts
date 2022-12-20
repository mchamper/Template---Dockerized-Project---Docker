import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { get, random } from "lodash";
import { catchError, Observable, of, tap, throwError } from "rxjs";
import { AuthService, TGuard } from "../services/auth.service";
import { AUTH_GUARD, AUTH_LOGOUT_ON_ERROR, ERR, ERR_AS_200, URL } from "./contexts";

export interface IHttpErrorResponse {
  code: number,
  type: string,
  status: number,
  body: any,
  message: string,
  errors: any,
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    protected _authS: AuthService,
  ) { }

  /* -------------------- */

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const guard: TGuard | null = req.context.get(AUTH_GUARD);

    return next.handle(req).pipe(
      catchError((event: HttpEvent<any>) => {
        if (event instanceof HttpErrorResponse) {
          let error: IHttpErrorResponse = {
            code: typeof event.error?.code !== 'undefined' ? event.error?.code : -1,
            type: typeof event.error?.type !== 'undefined' ? event.error?.type : 'UNHANDLED_FORMAT',
            status: typeof event.error?.status !== 'undefined' ? event.error?.status : event.status,
            body: typeof event.error?.body !== 'undefined' ? event.error?.body : null,
            message: typeof event.error?.message !== 'undefined' ? event.error?.message : event.statusText,
            errors: typeof event.error?.errors !== 'undefined' ? event.error?.errors : null,
          }

          const urlContext = req.context.get(URL);
          const resContext = req.context.get(ERR);
          const errAs200Context = req.context.get(ERR_AS_200);

          if (resContext) {
            error = {
              ...error,
              body: resContext.body ? get(event.error, resContext.body) : error.body,
              message: resContext.message ? get(event.error, resContext.message) : error.message,
              errors: resContext.errors ? get(event.error, resContext.errors) : error.errors,
            };
          }
          else if (urlContext === 'api') {
            error = {
              ...error,
              body: event.error,
            };
          }
          else if (urlContext === 'backend') {
            error = {
              ...error,
              body: event.error?.body,
            };
          }

          if (guard) {
            if (req.context.get(AUTH_LOGOUT_ON_ERROR)) {
              this._authS.logout(guard);
            }
          }

          if (errAs200Context && errAs200Context(error)) {
            return of(new HttpResponse({
              status: 200,
              body: error.body,
              statusText: error.message,
            }));
          }

          return throwError(() => error);
        }

        return throwError(() => event);
      }),
    );
  }
}
