import { EventEmitter } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { IHttpErrorResponse } from '../interceptors/error.interceptor';

export class Request {

  status: number = 0;
  error: IHttpErrorResponse | null = null;

  error$: EventEmitter<boolean> = new EventEmitter();
  reseted$: EventEmitter<void> = new EventEmitter();
  started$: EventEmitter<void> = new EventEmitter();
  completed$: EventEmitter<void> = new EventEmitter();

  constructor() { }

  /* -------------------- */

  isUnfired(): boolean {
    return this.status === 0;
  }

  isLoading(isUnfiredToo: boolean = false): boolean {
    if (isUnfiredToo) {
      return this.status === 0 || this.status === 1;
    }

    return this.status === 1;
  }

  isComplete(): boolean {
    return this.status === 2;
  }

  isSuccess(): boolean {
    return this.status === 2 && !this.error;
  }

  isError(): boolean {
    return this.status === 2 && !!this.error;
  }

  /* -------------------- */

  reset(): void {
    this.status = 0;
    this.error = null;

    this.error$.emit(false);
    this.reseted$.emit();
  }

  start(): void {
    this.status = 1;
    this.error = null;

    this.error$.emit(false);
    this.started$.emit();
  }

  complete(): void {
    this.status = 2;
    this.completed$.emit();
  }

  /* -------------------- */

  send<T>(subscriptions: Observable<T> | Observable<T>[]): Observable<T> {
    if (this.isLoading()) {
      return of();
    }

    this.start();

    let subscription: any;

    subscription = Array.isArray(subscriptions)
      ? forkJoin(subscriptions)
      : subscriptions;

    return subscription.pipe(
      catchError((err: IHttpErrorResponse) => {
        this.error = err;
        this.error$.emit(true);

        return throwError(() => err);
      }),
      finalize(() => this.complete()),
    );
  }
}
