import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cloneDeep } from "lodash";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { StorageService } from "../services/storage.service";

@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  private _cache: Map<string, HttpResponse<any>>;

  constructor(
    protected _storageS: StorageService,
  ) {
    this._cache = new Map(this._storageS.getSecureSession('httpCache'));
  }

  /* -------------------- */

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isCacheable(req)) {
      return next.handle(req);
    }

    let cachedResponseRaw: any = this._cache.get(req.urlWithParams);

    if (cachedResponseRaw && !(cachedResponseRaw instanceof HttpResponse)) {
      delete cachedResponseRaw.headers;
      cachedResponseRaw = new HttpResponse(cachedResponseRaw);
    }

    const cachedResponse: HttpResponse<any> = cachedResponseRaw;

    if (cachedResponse) {
      return of(cloneDeep(cachedResponse));
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this._cache.set(req.urlWithParams, cloneDeep(event));
          this._storageS.setSecureSession('httpCache', Array.from(this._cache.entries()));
        }
      })
    );
  }

  /* -------------------- */

  isCacheable(req: HttpRequest<any>): boolean {
    // return true;

    if (!environment.httpCache) {
      return false;
    }

    return req.method === 'GET' && (false
      || req.url.startsWith(`${environment.backendLaravelUrl}`)
      )
      ;
  }
}
