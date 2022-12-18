import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { random } from "lodash";
import { catchError, Observable, tap, throwError } from "rxjs";
import { AuthService, TGuard } from "../services/auth.service";
import { AUTH_GUARD, AUTH_LOGOUT_ON_ERROR } from "./contexts";

export interface IHttpErrorResponse {
  code: number,
  errors: any,
  message: string,
  status: number,
  type: string,
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
          const error: IHttpErrorResponse = {
            code: typeof event.error?.code !== 'undefined' ? event.error?.code : -1,
            errors: typeof event.error?.errors !== 'undefined' ? event.error?.errors : null,
            message: typeof event.error?.message !== 'undefined' ? event.error?.message : event.statusText,
            status: typeof event.error?.status !== 'undefined' ? event.error?.status : event.status,
            type: typeof event.error?.type !== 'undefined' ? event.error?.type : 'UNHANDLED_FORMAT',
          }

          if (guard) {
            if (req.context.get(AUTH_LOGOUT_ON_ERROR)) {
              this._authS.logout(guard);
            }
          }

          return throwError(() => error);
        }

        return throwError(() => event);
      }),
    );
  }
}
