import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AbstractInterceptor } from "./abstract.interceptor";
import { AUTH_LOGOUT_ON_ERROR } from "./contexts";

export interface IHttpErrorResponse {
  code: number,
  errors: any,
  message: string,
  status: number,
  type: string,
}

@Injectable()
export class ErrorInterceptor extends AbstractInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.resolveAuth(req);

    return next.handle(req).pipe(
      catchError((event: HttpEvent<any>) => {
        if (event instanceof HttpErrorResponse) {
          let error: IHttpErrorResponse = event.error?.error;

          if (!error) {
            error = {
              code: -1,
              errors: null,
              message: event.statusText,
              status: event.status,
              type: 'UnhandledFormat',
            }
          }

          if (!error.message) {
            error.message = event.statusText;
          }

          if (req.context.get(AUTH_LOGOUT_ON_ERROR)) {
            this._auth.logout(this._storeS);
            this._navS.router.navigate([this._navS.pages.AuthLoginPage.link()], { replaceUrl: true });
          }

          return throwError(() => error);
        }

        return throwError(() => event);
      }),
    );
  }
}
