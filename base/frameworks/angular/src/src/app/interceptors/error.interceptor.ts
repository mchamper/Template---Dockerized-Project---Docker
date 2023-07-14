import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { get } from "lodash";
import { catchError, Observable, of, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ERR_AS_200, FALLBACK_GUARD, GUARD, ON_ERROR } from "./contexts";

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
    const guardContext = req.context.get(GUARD) || req.context.get(FALLBACK_GUARD);
    const errAs200Context = req.context.get(ERR_AS_200);
    const onErrorContext = req.context.get(ON_ERROR);

    return next.handle(req).pipe(
      catchError((event: HttpEvent<any>) => {
        if (event instanceof HttpErrorResponse) {
          const error: IHttpErrorResponse = {
            status: get(event, 'error.status', event.status),
            message: get(event, 'error.message', event.statusText),
            body: get(event, 'error.body', null),
            name: get(event, 'error.name', null),
            exception: get(event, 'error.exception', null),
            code: get(event, 'error.code', -1),
            validation: get(event, 'error.validation', null),
          }

          if (guardContext) {
            if (error.status === 401 && error.name === 'INVALID_SESSION_ERROR') {
              this._authS.guard(guardContext).logout();
            }
          }

          if (errAs200Context && errAs200Context(error)) {
            return of(new HttpResponse({
              status: 200,
              statusText: error.message,
              body: error.body,
            }));
          }

          if (onErrorContext) {
            onErrorContext(error);
          }

          return throwError(() => error);
        }

        return throwError(() => event);
      }),
    );
  }
}
