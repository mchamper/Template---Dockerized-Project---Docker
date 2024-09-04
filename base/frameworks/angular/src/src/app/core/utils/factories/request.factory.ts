import { DestroyRef, Injector, inject, signal } from "@angular/core";
import { SearchHttpService } from "../../../services/http/general/search-http.service";
import { Request } from "../../features/request/request.class";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged } from "rxjs";

export const searchRequestFactory = (concept: string, injector?: Injector) => {
  const searchHttpS = inject(SearchHttpService);
  const search = signal('');

  const request = new Request({
    send: (...params: string[]) => searchHttpS.search(params[0], params[1]),
    watch: 'results',
    cancelable: true,
    notify: false,
    notifyError: false,
    injector: injector,
  });

  toObservable(search).pipe(
    takeUntilDestroyed(inject(DestroyRef)),
    distinctUntilChanged(),
    debounceTime(300),
  ).subscribe(value => {
    value.length > 2
      ? request.run(concept, value)
      : request.reset();
  });

  return {
    search,
    request,
  }
}
