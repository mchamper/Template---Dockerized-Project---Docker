import { computed, EventEmitter, signal } from "@angular/core";
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

export const createRequest = <
  GBody = unknown
>() => <
  GParams = { [key: string]: unknown },
>(
  config: Request<GBody, GParams>['_config'],
  options?: Request['_options'],
) => new Request<GBody, GParams>(config, options);

export const createDefaultRequest = <
  GBody = unknown
>() => <
  GParams = { [key: string]: unknown },
>(
  config?: Omit<Request<GBody, GParams>['_config'], 'send'>,
  options?: Request['_options'],
) => new Request<GBody, GParams>({ ...config, send: () => of()}, options);

/* -------------------- */

export class Request<
  GBody = unknown,
  GParams = { [key: string]: unknown },
> extends AbstractFeature {

  protected _config: {
    send: (...args: any) => Observable<THttpResponse<GBody>>,
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
  };

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
    config: Request<GBody, GParams>['_config'],
    options?: AbstractFeature['_options'],
  ) {
    super(options);

    this._config = {
      ...config,
      notify: get(config, 'notify', false),
      notifySuccess: get(config, 'notifySuccess', false),
      notifyError: get(config, 'notifyError', true),
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

    logger('Request cancelled.');
  };

  reset = () => {
    this.isLoading.set(false);
    this.res.set(undefined);
    this.error.set(undefined);

    if (this._config.bind) {
      this._config.bind.reset();
    }

    logger('Request reset.');
  };

  start = () => {
    this.cancel();
    this.isLoading.set(true);
    this.error.set(undefined);

    if (this._config.bind) {
      this._config.bind.start();
    }

    logger('Request started.');
  };

  complete = (value?: GBody) => {
    if (!isUndefined(value)) {
      this.setBody(value);
    }

    this.isLoading.set(false);

    if (this._config.bind) {
      this._config.bind.complete();
    }

    logger('Request completed.');
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

  send = (...args: any): Observable<THttpResponse> => {
    if (!this._config.cancelable && this.isLoading()) {
      logger(`Attempt to send prevented: request is not cancelable and it's loading.`);
      return of();
    }

    if (this._config.when && !this._config.when()) {
      logger(`Attempt to send prevented: request "when" option result is false.`);
      return of();
    }

    if (this._config.before) {
      this._config.before();
    }

    this.start();

    return this._config.send(...args)
      .pipe(
        takeUntilDestroyed(),
        takeUntil(this._cancel$),
        tap({
          next: (httpRes: THttpResponse) => {
            logger(`Request succeed.`);

            this.res.set(httpRes);

            this.notify('success');

            if (this._config.success) {
              this._config.success(httpRes);
            }

            if (this._config.after) {
              this._config.after();
            }

            this.complete();
          },
          error: (httpError: THttpErrorResponse) => {
            logger(`Request failed.`);

            this.error.set(httpError);

            this.notify('error');

            if (this._config.error) {
              this._config.error(httpError);
            }

            if (this._config.after) {
              this._config.after();
            }

            this.complete();
          },
        }),
      );
  };

  run = (...args: any) => {
    return this.send(...args).subscribe();
  }

  promise = (...args: any) => {
    return firstValueFrom(this.send(...args));
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

