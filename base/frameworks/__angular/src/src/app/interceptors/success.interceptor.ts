import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cloneDeep, get } from "lodash";
import { map, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { MAP, ON_SUCCESS } from "./contexts";

export interface IHttpResponse<T = any> {
  status: number,
  message: string,
  body: T,
}

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {

  constructor(
    protected _authS: AuthService,
  ) { }

  /* -------------------- */

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const mapContext = req.context.get(MAP);
    const onSuccessContext = req.context.get(ON_SUCCESS);

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const res: IHttpResponse = {
            status: get(event, 'body.status', event.status),
            message: get(event, 'body.message', event.statusText),
            body: get(event, 'body.body', event.body),
          }

          if (mapContext) {
            const originalBody = cloneDeep(res.body);

            res.body = {
              ...mapContext(res),
              _raw: originalBody,
            };
          }

          if (onSuccessContext) {
            onSuccessContext(res);
          }

          event = event.clone({ body: res });
        }

        return event;
      })
    );
  }
}
