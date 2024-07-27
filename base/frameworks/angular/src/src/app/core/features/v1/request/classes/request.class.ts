import { computed, DestroyRef, EventEmitter, inject, Injector, ProviderToken, signal } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { firstValueFrom, Observable, of, takeUntil, tap } from "rxjs";
import { THttpResponse } from "../../../../types/http-response.type";
import { THttpErrorResponse } from "../../../../types/http-error-response.type";
import { RequestComponent } from "../components/request/request.component";
import { get, isArray, isNull, isUndefined, set } from "lodash";
import { logger } from "../../../../utils/helpers/logger.helper";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { coreConfig } from "../../../../../configs/core.config";
import { AbstractFeature } from "../../../abstract-feature.class";

export class Request<GBody = any, GParams = any> extends AbstractFeature {

  private _nzNotificationS = this._inject(NzNotificationService);
  private _nzMessageS = this._inject(NzMessageService);

  private _cancel$ = new EventEmitter();

  isLoading = signal(false);
  isSuccess = computed(() => !!this.res() && !this.error());

  res = signal<THttpResponse<GBody> | undefined>(undefined);
  error = signal<THttpErrorResponse | undefined>(undefined);

  body = computed(() => this._config.watch
    ? get(this.res()?.body, this._config.watch, null)
    : this.res()?.body || null);

  hasValue = computed(() => isArray(this.body())
    ? (this.body() as GBody[]).length
    : !isNull(this.body()) && !isUndefined(this.body()));

  hasError = computed(() => !!this.error());

  constructor(
    private _config: {
      send: (...params: any) => Observable<THttpResponse<GBody>>,
      when?: () => boolean,
      before?: () => void,
      after?: () => void,
      success?: (res: THttpResponse) => void,
      error?: (err: THttpErrorResponse) => void,
      watch?: string,
      bind?: Request,
      cancelable?: boolean,
      notify?: boolean,
      notifySuccess?: boolean | [title: string, message: string],
      notifyError?: boolean | [title: string, message: string],
      type?: RequestComponent['type'],
      params?: GParams,
    },
    options?: AbstractFeature['_options'],
  ) {
    super(options);

    this._config = {
      ...this._config,
      notify: get(this._config, 'notify', false),
      notifySuccess: get(this._config, 'notifySuccess', false),
      notifyError: get(this._config, 'notifyError', true),
    };
  }

  get type() {
    return this._config.type || 'default';
  }

  get params() {
    return this._config.params;
  }

  /* -------------------- */

  cancel = (mustReset = false) => {
    this._cancel$.emit();

    if (this._config.bind) {
      this._config.bind.cancel();
    }

    if (mustReset) {
      this.reset();
    }
  };

  reset = () => {
    this.isLoading.set(false);
    this.res.set(undefined);
    this.error.set(undefined);

    if (this._config.bind) {
      this._config.bind.reset();
    }
  };

  start = () => {
    this.cancel();
    this.isLoading.set(true);
    this.error.set(undefined);

    if (this._config.bind) {
      this._config.bind.start();
    }
  };

  complete = (value?: GBody) => {
    if (!isUndefined(value)) {
      this.setBody(value);
    }

    this.isLoading.set(false);

    if (this._config.bind) {
      this._config.bind.complete();
    }
  };

  /* -------------------- */

  setBody = (value: GBody, runSuccess = false) => {
    this.res.set({
      status: 1,
      message: '',
      body: this._config.watch
        ? set({}, this._config.watch, value) as GBody
        : value,
    });

    if (runSuccess && this._config.success) {
      this._config.success(this.res()!);
    }
  }

  /* -------------------- */

  send = (...params: any): Observable<THttpResponse> => {
    if (!this._config.cancelable && this.isLoading()) {
      logger(`Request is not cancelable and it's loading.`);
      return of();
    }

    if (this._config.when && !this._config.when()) {
      logger(`Request "when" option result is false.`);
      return of();
    }

    if (this._config.before) {
      this._config.before();
    }

    this.start();

    return this._config.send(...params)
      .pipe(
        takeUntilDestroyed(),
        takeUntil(this._cancel$),
        tap({
          next: (httpRes: THttpResponse) => {
            this.res.set(httpRes);

            this.notify('success');

            if (this._config.success) {
              this._config.success(httpRes);
            }

            this.complete();
          },
          error: (httpError: THttpErrorResponse) => {
            this.error.set(httpError);

            this.notify('error');

            if (this._config.error) {
              this._config.error(httpError);
            }

            this.complete();
          },
          finalize: () => {
            if (this._config.after) {
              this._config.after();
            }
          }
        }),
      );
  };

  run = (...params: any) => {
    return this.send(...params).subscribe();
  }

  promise = (...params: any) => {
    return firstValueFrom(this.send(...params));
  }

  /* -------------------- */

  notify(type: 'success' | 'error', service: 'notification' | 'message' = coreConfig.requestNotifyService) {
    let optionKey: 'notifySuccess' | 'notifyError';
    let title: string;
    let content: string;

    switch (type) {
      case 'success': {
        optionKey = 'notifySuccess';
        title = '¡Perfecto!';
        content = this.res()?.message || 'La solicitud ha sido enviada con éxito.';

        break;
      }

      case 'error': {
        optionKey = 'notifyError';
        title = 'Mmm...';
        content = this.error()?.message || 'Ha ocurrido un error.';

        break;
      }
    }

    const notifyOption = (this._config as any)[optionKey];

    if (this._config?.notify || notifyOption) {
      if (isArray(notifyOption)) {
        if (notifyOption[0]) title = notifyOption[0];
        if (notifyOption[1]) content = notifyOption[1];
      }

      if (service === 'notification') {
        this._nzNotificationS[type](
          `<strong>${title}</strong>`,
          `${content}`,
        );
      }

      if (service === 'message') {
        this._nzMessageS[type](
          `${content}`,
        );
      }
    }
  }
}

/* -------------------- */
/* -------------------- */
/* -------------------- */

export const createRequest = <GBody = any, GParams = any>(
  config: Request['_config'],
) => {
  return new Request<GBody, GParams>(config);
};

export const createDefaultRequest = <GBody = any, GParams = any>(
  config?: Omit<Request['_config'], 'send'> & { send?: Request['_config'] },
) => {
  return new Request<GBody, GParams>({ ...config, send: () => of()});
};
