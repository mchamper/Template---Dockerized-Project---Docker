import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { cloneDeep, isDate } from "lodash";
import { formValidatorMessages } from "./form-validators";
import { RequestHandler } from "../handlers/request-handler/request-handler";
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import * as moment from "moment";
import { IHttpErrorResponse } from "src/app/interceptors/error.interceptor";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { inject } from "@angular/core";
import { environment } from "src/environments/environment";
import { IHttpResponse } from "src/app/interceptors/success.interceptor";

export enum FormUnpreparedReasonEnum {
  IS_LOADING = 'IS_LOADING',
  IS_SUCCESS_AND_PRISTINE = 'IS_SUCCESS_AND_PRISTINE',
  IS_INVALID = 'IS_INVALID',
}

export class Form {

  state: {
    init$: BehaviorSubject<any>,
    current$: BehaviorSubject<any>,
    get: () => any,
    get$: () => BehaviorSubject<any>,
    set: (value?: any) => void,
    persist: (value?: any) => void,
  } = {
    init$: new BehaviorSubject(null),
    current$: new BehaviorSubject(null),
    get: (): any => {
      return this.state.get$().value;
    },
    get$: (): BehaviorSubject<any> => {
      return this.state.current$.value
        ? this.state.current$
        : this.state.init$;
    },
    set: (value?: any): void => {
      this.state.init$.next(cloneDeep(value || this.group.getRawValue()));
      this.state.current$.next(cloneDeep(this.state.init$.value));
    },
    persist: (value?: any): void => {
      this.state.current$.next(cloneDeep(value || this.group.getRawValue()));
    },
  };

  groupInit!: FormGroup;
  combos!: { [key: string]: any[] };

  requestH: RequestHandler = new RequestHandler();
  dataRequestH: RequestHandler = new RequestHandler();
  combosRequestH: RequestHandler = new RequestHandler();

  private _nzNotificationS: NzNotificationService = inject(NzNotificationService);

  constructor(
    public group: FormGroup,
    public options: {
      onInit?: (form: Form) => any,
      arrays?: {
        [key: string]: {
          group: FormGroup,
          onAdd?: (group: FormGroup) => any
        }
      },
      mock?: any
    } = {},
  ) {

    this.state.set(!environment.production ? options?.mock : null);
    this.reset(true);

    this.groupInit = cloneDeep(this.group);

    this._init();
  }

  /* -------------------- */

  private _init() {
    if (this.options.onInit) {
      this.options.onInit(this);
    }
  }

  set(value: any) {
    this.state.persist({
      ...this.group.getRawValue(),
      ...value
    });

    this.restore();
  }

  restore(withInit?: boolean): void {
    this.group = cloneDeep(this.groupInit);
    this._init();

    if (withInit) {
      this.state.current$.next(null);
    }

    this.reset();
    this.requestH.reset();
  }

  /* -------------------- */

  reset(withInit?: boolean, options?: any): void {
    this.group.reset(withInit ? this.state.init$.value : this.state.get(), options);
  }

  resetErrors(options?: any): void {
    this.group.reset(this.group.getRawValue(), options);
  }

  /* -------------------- */

  getCombo(key: string): any[] {
    return this.combos
      ? this.combos[key] || []
      : [];
  }

  getFromCombo(key: string, value: any[], multi: boolean = false) {
    const compareField: string = value[1];
    value = value[0];

    return this.combos
      ? (this.combos[key] || [])[multi ? 'filter' : 'find'](item => compareField ? item[compareField] === value : item === value)
      : null;
  }

  compareFn(o1: any, o2: any): boolean {
    if (o1 && o2) {
      if (o1.hasOwnProperty('value') && o2.hasOwnProperty('value')) {
        return o1.value === o2.value;
      }

      if (o1.hasOwnProperty('id') && o2.hasOwnProperty('id')) {
        return o1.id === o2.id;
      }
    }

    return o1 === o2;
  }

  /* -------------------- */

  getValue(key: string, field?: string): any {
    let value = this.group.get(key)?.value;

    if (field) {
      const fields: string[] = field.split('|');

      if (Array.isArray(value)) {
        return value.map(item => {
          if (item?.hasOwnProperty(fields[0])) return item?.[fields[0]];
          if (item?.hasOwnProperty(fields[1])) return item?.[fields[1]];
          return item;
        });
      }

      if (value?.hasOwnProperty(fields[0])) return value?.[fields[0]];
      if (value?.hasOwnProperty(fields[1])) return value?.[fields[1]];
      return value;
    }

    return value;
  }

  getControl(key: string): AbstractControl | null {
    return this.group.get(key);
  }

  /* -------------------- */

  getValuesForQueryParams(prefix: string = ''): any {
    const queryParams: any = {};

    Object.keys(this.group.controls).forEach((key: string) => {
      let value = this.getValue(key);

      if (Array.isArray(value) && value.length) {
        value = value.map(item => {
          return isDate(item) ? moment(item).toISOString(true) : item;
        });

        value = '(' + value.join(',') + ')';
      }

      queryParams[`${prefix}${key}`] = isDate(value) ? moment(value).toISOString(true) : value;
    });

    return queryParams;
  }

  setValuesFromQueryParams(queryParams: { [key: string]: string }, prefix: string = ''): void {
    const formValues: any = {};

    Object.keys(queryParams).forEach((key: string) => {
      if (key.startsWith(prefix)) {
        let value: any = queryParams[key];
        key = key.replace(prefix, '');

        formValues[key] = value?.startsWith('(')
          ? value.replace('(', '').replace(')', '').split(',').map((item: any) => !isNaN(item) ? parseFloat(item) : item)
          : !isNaN(value) ? parseFloat(value) : value;
      }
    });

    this.state.persist({ ...this.state.get(), ...formValues });
    this.reset(false, { onlySelf: true });
  }

  /* -------------------- */

  getLocalError(key: string | any[], messages?: any): string {
    let group = this.group;

    if (Array.isArray(key)) {
      group = key[1];
      key = key[0];
    }

    for (const errorKey in group.get(key)?.errors) {
      if (messages && messages[errorKey]) {
        return messages[errorKey];
      }

      if (formValidatorMessages[errorKey]) {
        const message: any = formValidatorMessages[errorKey];

        if (errorKey === 'mask') {
          const mask = (group.get(key)?.errors as any)[errorKey].requiredMask;
          return message(mask);
        }

        return message;
      }
    }

    return '';
  }

  getError(key: string | any[], localFirst?: boolean): string {
    let group = this.group;

    if (Array.isArray(key)) {
      group = key[1];
      key = key[0];
    }

    const error = group.get(key)?.getError('apiError');

    if (localFirst) {
      return this.getLocalError(key) || error;
    }

    return error;
  }

  setErrors(errors: any = null): void {
    if (errors) {
      for (const key in errors) {
        let field = key;
        let control = this.group.get(field);

        while (!control && field) {
          field = field.split('.').slice(0, -1).join('.');
          control = this.group.get(field);
        }

        if (control) {
          control.markAsDirty();
          control.setErrors({ apiError: errors[key] });
        }
      }
    }
  }

  /* -------------------- */

  add(control: FormArray | string, groupArrayKey: string = ''): void {
    if (!this.options.arrays) {
      return;
    }

    if (typeof control === 'string') {
      groupArrayKey = control;
      control = this.group.get(groupArrayKey) as FormArray;
    }

    const group = cloneDeep(this.options.arrays[groupArrayKey].group);

    if (this.options.arrays[groupArrayKey].onAdd) {
      (this.options.arrays[groupArrayKey].onAdd as Function)(group);
    }

    control.push(group);
  }

  remove(control: FormArray | string, index: number): void {
    if (typeof control === 'string') {
      control = this.group.get(control) as FormArray;
    }

    control.removeAt(index);
  }

  /* -------------------- */

  castFC(control: AbstractControl | null): FormControl {
    return control as FormControl;
  }

  castFG(control: AbstractControl | null): FormGroup {
    return control as FormGroup;
  }

  castFA(control: AbstractControl | null): FormArray {
    return control as FormArray;
  }

  /* -------------------- */

  prepare(group?: FormGroup | FormArray, mustResetErrors: boolean = true): {
    status: boolean,
    reason?: FormUnpreparedReasonEnum
  } {
    const formGroup = group || this.group;

    if (this.requestH.isLoading()) {
      return {
        status: false,
        reason: FormUnpreparedReasonEnum.IS_LOADING,
      };
    }

    if (this.requestH.isSuccess() && formGroup.pristine) {
      return {
        status: false,
        reason: FormUnpreparedReasonEnum.IS_SUCCESS_AND_PRISTINE,
      };
    }

    this.validate(formGroup);

    if (formGroup.invalid) {
      return {
        status: false,
        reason: FormUnpreparedReasonEnum.IS_INVALID,
      };
    };

    if (mustResetErrors) {
      this.resetErrors();
    }

    return {
      status: true
    };
  }

  validate(group?: FormGroup | FormArray): void {
    const formGroup = group || this.group;

    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);

      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        this.validate(abstractControl);
      } else {
        abstractControl?.markAsTouched();
        abstractControl?.updateValueAndValidity();
      }
    });
  }

  /* -------------------- */

  send(
    observable: Observable<any>,
    options?: {
      unprepared?: (reason: FormUnpreparedReasonEnum) => void,
      before?: () => void,
      success?: (res: IHttpResponse) => void,
      error?: (err: IHttpErrorResponse) => void,
      after?: () => void,
      reset?: boolean,
      persist?: boolean,
      notify?: boolean,
      notifySuccess?: boolean | string[],
      notifyError?: boolean | string[],
    }
  ): Observable<IHttpResponse> {
    const defaultOptions = {
      unprepared: typeof options?.unprepared !== 'undefined' ? options?.unprepared : null,
      before: typeof options?.before !== 'undefined' ? options?.before : null,
      success: typeof options?.success !== 'undefined' ? options?.success : null,
      error: typeof options?.error !== 'undefined' ? options?.error : null,
      after: typeof options?.after !== 'undefined' ? options?.after : null,
      reset: typeof options?.reset !== 'undefined' ? options?.reset : false,
      persist: typeof options?.persist !== 'undefined' ? options?.persist : false,
      notify: typeof options?.notify !== 'undefined' ? options?.notify : false,
      notifySuccess: typeof options?.notifySuccess !== 'undefined' ? options?.notifySuccess : false,
      notifyError: typeof options?.notifyError !== 'undefined' ? options?.notifyError : true,
    }

    const prepare = this.prepare();

    if (!prepare.status && prepare.reason) {
      if (defaultOptions.unprepared) {
        defaultOptions.unprepared(prepare.reason);
      }

      return of();
    }

    if (defaultOptions.before) {
      defaultOptions.before();
    }

    return this.requestH.send(observable).pipe(
      tap({
        next: (res: IHttpResponse) => {
          if (defaultOptions.reset) {
            this.reset();
          } else if (defaultOptions.persist) {
            this.state.persist();
          }

          if (defaultOptions.notify || defaultOptions.notifySuccess) {
            let title: string = 'Solicitud enviada';
            let content: string = 'Su solicitud ha sido enviada con éxito.';

            if (Array.isArray(defaultOptions.notifySuccess)) {
              if (defaultOptions.notifySuccess[0]) title = defaultOptions.notifySuccess[0];
              if (defaultOptions.notifySuccess[1]) content = defaultOptions.notifySuccess[1];
            }

            this._nzNotificationS.success(
              `<strong>${title}</strong>`,
              `${content}`,
            );
          }

          if (defaultOptions.success) {
            defaultOptions.success(res);
          }
        },
        error: (err: IHttpErrorResponse) => {
          this.setErrors(err.errors);

          if (defaultOptions.notify || defaultOptions.notifyError) {
            let title: string = 'Mmm...';
            let content: string = err.message || 'Ha ocurrido un error.';

            if (Array.isArray(defaultOptions.notifyError)) {
              if (defaultOptions.notifyError[0]) title = defaultOptions.notifyError[0];
              if (defaultOptions.notifyError[1]) content = defaultOptions.notifyError[1];
            }

            this._nzNotificationS.error(
              `<strong>${title}</strong>`,
              `${content}`,
            );
          }

          if (defaultOptions.error) {
            defaultOptions.error(err);
          }
        },
        complete: () => {
          if (defaultOptions.after) defaultOptions.after();
        },
      }),
    );
  }
}
