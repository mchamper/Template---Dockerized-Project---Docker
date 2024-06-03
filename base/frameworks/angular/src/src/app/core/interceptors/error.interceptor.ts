import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { THttpErrorResponse } from "../types/http-error-response.type";
import { ERR_AS_200, FALLBACK_GUARD, GUARD, MAP_MESSAGE, ON_ERROR } from "./contexts";
import { catchError, Observable, of, throwError } from "rxjs";
import { get } from "lodash";

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authS = inject(AuthService);

  const guardContext = req.context.get(GUARD) || req.context.get(FALLBACK_GUARD);
  const mapMessageContext = req.context.get(MAP_MESSAGE);
  const errAs200Context = req.context.get(ERR_AS_200);
  const onErrorContext = req.context.get(ON_ERROR);

  return next(req).pipe(
    catchError((event: HttpEvent<any>) => {
      if (event instanceof HttpErrorResponse) {
        const error: THttpErrorResponse = {
          status: get(event, 'error.status', event.status),
          message: get(event, 'error.message', event.statusText),
          body: get(event, 'error.body', event.error),
          name: get(event, 'error.name', null),
          exception: get(event, 'error.exception', null),
          code: get(event, 'error.code', -1),
          validation: get(event, 'error.validation', null),
        }

        if (guardContext) {
          if (error.status === 401 && error.name === 'INVALID_SESSION_ERROR') {
            authS.guard(guardContext).removeSession();
          }
        }

        if (mapMessageContext) {
          error.message = mapMessageContext(error) || error.message;
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
