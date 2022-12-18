import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cloneDeep } from "lodash";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { httpMock } from "../mocks/http.mock";
import { URL_ORIGINAL } from "./contexts";

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url: string = req.context.get(URL_ORIGINAL) || '';

    if (!environment.production && environment.httpMock) {
      if (httpMock && httpMock[url]) {
        return of(new HttpResponse({
          status: 200,
          body: cloneDeep(httpMock[url])
        }));
      }
    }

    return next.handle(req);
  }
}
