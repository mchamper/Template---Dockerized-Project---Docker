import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractInterceptor } from "./abstract.interceptor";

@Injectable()
export class RequestInterceptor extends AbstractInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.resolveAuth(req);

    let headers: HttpHeaders;

    headers = req.headers.set('Accept', 'application/json');
    headers = req.headers.set('Accept-Language', 'en');

    if (this._auth?.token) {
      headers = req.headers.set('Authorization', `bearer ${this._auth.token}`);
    }

    return next.handle(req.clone({
      url: req.url.startsWith('http') ? req.url : environment.apiUrl + req.url,
      headers,
    }));
  }
}
