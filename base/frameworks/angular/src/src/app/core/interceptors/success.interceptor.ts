import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { THttpResponse } from "../types/http-response.type";
import { MAP_BODY, MAP_MESSAGE, ON_SUCCESS, SUCCESS_KEYS } from "./contexts";
import { map, Observable } from "rxjs";
import { cloneDeep, get } from "lodash";

export function successInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const resKeys = req.context.get(SUCCESS_KEYS);
  const mapBodyContext = req.context.get(MAP_BODY);
  const mapMessageContext = req.context.get(MAP_MESSAGE);
  const onSuccessContext = req.context.get(ON_SUCCESS);

  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const res: THttpResponse = {
          status: get(event, resKeys?.status || 'body.status', event.status),
          message: get(event, resKeys?.message || 'body.message', event.statusText),
          body: get(event, resKeys?.body || 'body.body', event.body),
        }

        if (mapBodyContext) {
          const originalBody = cloneDeep(res.body);

          res.body = {
            ...mapBodyContext(res),
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
