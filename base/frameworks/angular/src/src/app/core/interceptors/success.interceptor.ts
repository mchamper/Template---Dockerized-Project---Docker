import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { THttpResponse } from "../types/http-response.type";
import { MAP, MAP_MESSAGE, ON_SUCCESS } from "./contexts";
import { map, Observable } from "rxjs";
import { cloneDeep, get } from "lodash";

export function successInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const mapContext = req.context.get(MAP);
  const mapMessageContext = req.context.get(MAP_MESSAGE);
  const onSuccessContext = req.context.get(ON_SUCCESS);

  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const res: THttpResponse = {
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

        if (mapMessageContext) {
          res.message = mapMessageContext(res) || res.message;
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
