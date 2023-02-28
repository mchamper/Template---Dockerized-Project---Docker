import { Observable, forkJoin, of, BehaviorSubject } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { IHttpErrorResponse } from 'src/app/interceptors/error.interceptor';
import { IHttpResponse } from 'src/app/interceptors/success.interceptor';

export class RequestHandler {

  status$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  res$: BehaviorSubject<IHttpResponse | null> = new BehaviorSubject<IHttpResponse | null>(null);
  err$: BehaviorSubject<IHttpErrorResponse | null> = new BehaviorSubject<IHttpErrorResponse | null>(null);

  constructor() { }

  /* -------------------- */

  isUnfired(): boolean {
    return this.status$.value === 0;
  }
  isUnfired$(): Observable<boolean> {
    return this.status$.pipe(map(() => this.isUnfired()));
  }

  isLoading(isUnfiredToo: boolean = false): boolean {
    if (isUnfiredToo) {
      return this.status$.value === 0 || this.status$.value === 1;
    }

    return this.status$.value === 1;
  }
  isLoading$(isUnfiredToo: boolean = false): Observable<boolean> {
    return this.status$.pipe(map(() => this.isLoading(isUnfiredToo)));
  }

  isComplete(): boolean {
    return this.status$.value === 2;
  }
  isComplete$(): Observable<boolean> {
    return this.status$.pipe(map(() => this.isComplete()));
  }

  isSuccess(): boolean {
    return this.status$.value === 2 && !this.err$.value;
  }
  isSuccess$(): Observable<boolean> {
    return this.status$.pipe(map(() => this.isSuccess()));
  }

  isError(): boolean {
    return this.status$.value === 2 && !!this.err$.value;
  }
  isError$(): Observable<boolean> {
    return this.status$.pipe(map(() => this.isError()));
  }

  /* -------------------- */

  mustDisableInteraction(): boolean {
    return this.isLoading() || this.isError();
  }
  mustDisableInteraction$(): Observable<boolean> {
    return this.status$.pipe(map(() => this.mustDisableInteraction()));
  }

  /* -------------------- */

  reset(): void {
    this.status$.next(0);
    this.res$.next(null);
    this.err$.next(null);
  }

  start(): void {
    this.status$.next(1);
    this.res$.next(null);
    this.err$.next(null);
  }

  complete(): void {
    this.status$.next(2);
  }

  /* -------------------- */

  send(observables: Observable<any> | Observable<any>[]): Observable<IHttpResponse> {
    if (this.isLoading()) {
      return of();
    }

    this.start();

    let observable: any;

    observable = Array.isArray(observables)
      ? forkJoin(observables)
      : observables;

    return observable.pipe(
      finalize(() => this.complete()),
      tap({
        next: (res: IHttpResponse) => {
          this.res$.next(res);
          this.complete();
        },
        error: (err: IHttpErrorResponse) => {
          this.err$.next(err);
          this.complete();
        },
      }),
    );
  }
}
