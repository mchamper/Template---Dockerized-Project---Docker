import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { THttpErrorResponse } from "../types/http-error-response.type";
import { ERROR_KEYS, ERR_AS_SUCCESS, FALLBACK_GUARD, GUARD, MAP_MESSAGE, ON_ERROR, ON_ERROR_401 } from "./contexts";
import { catchError, Observable, of, throwError } from "rxjs";
import { get } from "lodash";

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authS = inject(AuthService);

  const guardContext = req.context.get(GUARD) || req.context.get(FALLBACK_GUARD);
  const resKeys = req.context.get(ERROR_KEYS);
  const mapMessageContext = req.context.get(MAP_MESSAGE);
  const errAsSuccessContext = req.context.get(ERR_AS_SUCCESS);
  const onErrorContext = req.context.get(ON_ERROR);
  const onError401Context = req.context.get(ON_ERROR_401);

  return next(req).pipe(
    catchError((event: HttpEvent<any>) => {
      if (event instanceof HttpErrorResponse) {
        const error: THttpErrorResponse = {
          status: get(event, resKeys?.status || 'error.status', event.status),
          message: get(event, resKeys?.message || 'error.message', event.statusText),
          body: get(event, resKeys?.body || 'error.body', event.error),
          name: get(event, resKeys?.name || 'error.name', ''),
          exception: get(event, resKeys?.exception || 'error.exception', ''),
          code: get(event, resKeys?.code ||  'error.code', -1),
          validation: get(event, resKeys?.validation ||  'error.validation'),
        }

        if (guardContext) {
          if (error.status === 401 && error.name === 'InvalidSession') {
            authS.guard(guardContext).removeSession();
          }
        }

        if (mapMessageContext) {
          error.message = mapMessageContext(error) || error.message;
        }

        if (errAsSuccessContext && errAsSuccessContext(error)) {
          return of(new HttpResponse({
            status: 200,
            statusText: error.message,
            body: error.body,
          }));
        }

        if (onErrorContext) {
          onErrorContext(error);
        }

        if (onError401Context && error.status === 401) {
          onError401Context(error);
        }

        return throwError(() => error);
      }

      return throwError(() => event);
    }),
  );
}
