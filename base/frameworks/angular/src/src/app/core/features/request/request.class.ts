import { EventEmitter, Injector, ProviderToken, computed, inject, signal } from "@angular/core";
import { THttpResponse } from "../../types/http-response.type";
import { THttpErrorResponse } from "../../types/http-error-response.type";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Observable, of, takeUntil, tap } from "rxjs";
import { get, isArray } from "lodash";
import { logger } from "../../utils/helpers/logger.helper";
import { RequestComponent } from "./components/request/request.component";
export class Request<Body = any> {

  private _nzNotificationS = this._inject(NzNotificationService);

  private _cancel$ = new EventEmitter();

  isLoading = signal(false);
  isSuccess = computed(() => !!this.res() && !this.error());

  res = signal<THttpResponse<Body> | undefined>(undefined);
  error = signal<THttpErrorResponse | undefined>(undefined);

  body = computed(() => this._options.watch ? get(this.res()?.body, this._options.watch, null) : this.res()?.body || null);

  hasValue = computed(() => !!this.body());
  hasError = computed(() => !!this.error());

  type = this._options.type || 'default';

  constructor(
    private _options: {
      send?: (...params: any) => Observable<THttpResponse>,
      when?: () => boolean,
      before?: () => void,
      success?: (res: THttpResponse) => void,
      error?: (err: THttpErrorResponse) => void,
      watch?: string,
      bind?: Request,
      cancelable?: boolean,
      notify?: boolean,
      notifySuccess?: boolean | [title: string, content: string],
      notifyError?: boolean | [title: string, content: string],
      type?: RequestComponent['type'],
      injector?: Injector,
    } = {},
  ) {

    this._options = {
      ...this._options,
      notify: get(this._options, 'notify', false),
      notifySuccess: get(this._options, 'notifySuccess', false),
      notifyError: get(this._options, 'notifyError', true),
    };
  }

  private _inject<T = any>(token: ProviderToken<T>) {
    return this._options.injector?.get(token) || inject(token);
  }

  /* -------------------- */

  cancel = (mustReset: boolean = false) => {
    this._cancel$.emit();

    if (this._options.bind) {
      this._options.bind.cancel();
    }

    if (mustReset) {
      this.reset();
    }
  };

  reset = () => {
    this.isLoading.set(false);
    this.res.set(undefined);
    this.error.set(undefined);

    if (this._options.bind) {
      this._options.bind.reset();
    }
  };

  start = () => {
    this.cancel();
    this.isLoading.set(true);
    this.error.set(undefined);

    if (this._options.bind) {
      this._options.bind.start();
    }
  };

  complete = () => {
    this.isLoading.set(false);

    if (this._options.bind) {
      this._options.bind.complete();
    }
  };

  /* -------------------- */

  send = (...params: any): Observable<THttpResponse> => {
    if (!this._options.send) {
      logger(`Request has not "send" configured.`);
      return of();
    }

    if (!this._options.cancelable && this.isLoading()) {
      logger(`Request is not cancelable and it's loading.`);
      return of();
    }

    if (this._options.when && !this._options.when()) {
      logger(`Request "when" option result is false.`);
      return of();
    }

    if (this._options.before) {
      this._options.before();
    }

    this.start();

    return this._options.send!(params).pipe(
      takeUntil(this._cancel$),
      tap({
        next: (httpRes: THttpResponse) => {
          this.res.set(httpRes);

          this._notify('success');

          if (this._options.success) {
            this._options.success(httpRes);
          }
        },
        error: (httpError: THttpErrorResponse) => {
          this.error.set(httpError);

          this._notify('error');

          if (this._options.error) {
            this._options.error(httpError);
          }
        },
        finalize: () => {
          this.complete();
        }
      }),
    );
  };

  run = (...params: any) => {
    return this.send(...params).subscribe();
  }

  /* -------------------- */

  private _notify(type: 'success' | 'error') {
    let optionKey: 'notifySucces' | 'notifyError';
    let title: string;
    let content: string;

    switch (type) {
      case 'success': {
        optionKey = 'notifySucces';
        title = '¡Perfecto!';
        content = this.res()!.message || 'La solicitud ha sido enviada con éxito.';

        break;
      }

      case 'error': {
        optionKey = 'notifyError';
        title = 'Mmm...';
        content = this.error()!.message || 'Ha ocurrido un error.';

        break;
      }
    }

    const notifyOption = (this._options as any)[optionKey];

    if (this._options?.notify || notifyOption) {
      if (isArray(notifyOption)) {
        if (notifyOption[0]) title = notifyOption[0];
        if (notifyOption[1]) content = notifyOption[1];
      }

      this._nzNotificationS[type](
        `<strong>${title}</strong>`,
        `${content}`,
      );
    }
  }
}
