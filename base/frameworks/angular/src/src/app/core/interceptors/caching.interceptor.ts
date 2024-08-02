import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { CacheService } from "../services/cache.service";
import { coreConfig } from "../../configs/core.config";

export function cacheInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  const cacheS = inject(CacheService);

  const isCacheable = typeof coreConfig.http.cache.enabled === 'function'
    ? coreConfig.http.cache.enabled(req)
    : coreConfig.http.cache.enabled;

  if (!isCacheable) {
    return next(req);
  }

  const cachedResponse = cacheS.get(req.urlWithParams);

  if (cachedResponse) {
    return of(new HttpResponse(cachedResponse as any));
  }

  return next(req).pipe(
    tap((res) => cacheS.set(req.urlWithParams, res, coreConfig.http.cache.ttl))
  );
}
