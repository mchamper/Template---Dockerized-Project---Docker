import { Injector, inject, signal } from '@angular/core';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IHttpErrorResponse } from 'src/app/interceptors/error.interceptor';
import { IHttpResponse } from 'src/app/interceptors/success.interceptor';
import { RequestComponent } from './components/request/request.component';
import { get } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export class Request<Body = any> {

  status = signal<number>(0);
  res = signal<IHttpResponse | null>(null);
  err = signal<IHttpErrorResponse | null>(null);
  body = signal<Body | null>(null);

  type: RequestComponent['type'] = 'default';

  private _nzNotificationS = this._options.injector?.get(NzNotificationService) || inject(NzNotificationService);

  constructor(
    private _options: {
      send?: (...params: any) => Observable<any> | Observable<any>[],
      before?: () => void,
      success?: (res: IHttpResponse) => void,
      error?: (err: IHttpErrorResponse) => void,
      after?: () => void,
      body?: string,
      bind?: Request,
      notify?: boolean,
      notifySuccess?: boolean | [title: string, content: string],
      notifyError?: boolean | [title: string, content: string],
      value?: any,
      type?: RequestComponent['type'],
      injector?: Injector,
    } = {},
  ) {

    if (this._options.value) {
      this.set(this._options.value);
    }

    if (this._options.type) {
      this.type = this._options.type;
    }
  }

  /* -------------------- */

  isUnfired(): boolean {
    return this.status() === 0;
  }

  isLoading(strict: boolean = false): boolean {
    if (strict) {
      return this.isUnfired() || this.status() === 1;
    }

    return this.status() === 1;
  }

  isCompleted(): boolean {
    return this.status() === 2;
  }

  isSuccess(): boolean {
    return this.isCompleted() && !this.err();
  }

  isError(): boolean {
    return this.isCompleted() && !!this.err();
  }

  /* -------------------- */

  reset(): void {
    this.status.set(0);
    this.setRes(null);
    this.err.set(null);

    if (this._options.bind) {
      this._options.bind.reset();
    }
  }

  start(): void {
    this.status.set(1);
    this.err.set(null);

    if (this._options.bind) {
      this._options.bind.start();
    }
  }

  complete(): void {
    this.status.set(2);

    if (this._options.bind) {
      this._options.bind.complete();
    }
  }

  /* -------------------- */

  setRes(res: IHttpResponse | null): void {
    this.res.set(res);

    if (this.res()) {
      this._options.body
        ? this.body.set(get(this.res()?.body, this._options.body, null))
        : this.body.set(this.res()?.body);
    } else {
      this.body.set(null);
    }
  }

  setBody(body: any): void {
    this.body.set(body);

    this.res.update(res => {
      if (!res) {
        return res;
      }

      return {
        ...res,
        body: this.body(),
      }
    });
  }

  set(value: Body): void {
    this.setRes({
      status: 0,
      message: '',
      body: value,
    });

    this.complete();
  }

  /* -------------------- */

  private _getObservable(params?: any): Observable<any> {
    const observables = this._options.send
      ? this._options.send(...params)
      : undefined;

    let observable: Observable<any>;

    if (observables) {
      observable = Array.isArray(observables)
        ? forkJoin(observables)
        : observables;
    } else {
      throw 'No observable found on request config.';
    }

    return observable;
  }

  send(params?: any): Observable<IHttpResponse> {
    if (this.isLoading()) {
      return of();
    }

    const options = {
      ...this._options,
      notify: get(this._options, 'notify', false),
      notifySuccess: get(this._options, 'notifySuccess', false),
      notifyError: get(this._options, 'notifyError', true),
    };

    if (options.before) {
      options.before();
    }

    this.start();

    return this._getObservable(params).pipe(
      tap({
        next: (res: IHttpResponse) => {
          this.setRes(res);
          this.complete();

          if (options?.notify || options?.notifySuccess) {
            let title: string = '¡Perfecto!';
            let content: string = res.message || 'Su solicitud ha sido enviada con éxito.';

            if (Array.isArray(options.notifySuccess)) {
              if (options.notifySuccess[0]) title = options.notifySuccess[0];
              if (options.notifySuccess[1]) content = options.notifySuccess[1];
            }

            this._nzNotificationS.success(
              `<strong>${title}</strong>`,
              `${content}`,
            );
          }

          if (options.success) {
            options.success(res);
          }
        },
        error: (err: IHttpErrorResponse) => {
          this.err.set(err);
          this.complete();

          if (options?.notify || options?.notifyError) {
            let title: string = 'Mmm...';
            let content: string = err.message || 'Ha ocurrido un error.';

            if (Array.isArray(options.notifyError)) {
              if (options.notifyError[0]) title = options.notifyError[0];
              if (options.notifyError[1]) content = options.notifyError[1];
            }

            this._nzNotificationS.error(
              `<strong>${title}</strong>`,
              `${content}`,
            );
          }

          if (options.error) {
            options.error(err);
          }
        },
        complete: () => {
          if (options.after) {
            options.after();
          }
        },
      }),
    );
  }

  run = (...params: any): Subscription => {
    return this.send(params).subscribe();
  }
}
