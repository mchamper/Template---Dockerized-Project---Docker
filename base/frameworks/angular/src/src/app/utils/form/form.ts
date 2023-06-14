import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { cloneDeep, isDate } from "lodash";
import { RequestHandler } from "../handlers/request-handler/request-handler";
import { BehaviorSubject, Observable, filter, of, tap } from "rxjs";
import * as moment from "moment";
import { IHttpErrorResponse } from "src/app/interceptors/error.interceptor";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { EventEmitter, WritableSignal, inject, signal } from "@angular/core";
import { environment } from "src/environments/environment";
import { IHttpResponse } from "src/app/interceptors/success.interceptor";

type TRequestType = 'data' | 'combos' | 'upload';

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

  group: FormGroup;
  combos: { [key: string]: any[] } = {};
  combos$: WritableSignal<{ [key: string]: any[] }> = signal({});

  requestH: RequestHandler = new RequestHandler('formRequest');
  dataRequestH: RequestHandler = new RequestHandler('dataRequest');
  combosRequestH: RequestHandler = new RequestHandler('combosRequest');
  uploadRequestH: RequestHandler = new RequestHandler('uploadRequest');

  private _fb: FormBuilder = inject(FormBuilder);
  private _nzNotificationS: NzNotificationService = inject(NzNotificationService);

  constructor(
    group: FormGroup = new FormGroup({}),
    public options: {
      onInit?: (form: Form) => any,
      onInitSubscriptions?: (form: Form) => any,
      onSubmit?: () => any,
      arrays?: {
        [key: string]: {
          group: FormGroup,
          onAdd?: (group: FormGroup, form: Form) => any,
          onMove?: (eachControl: FormControl, newIndex: number) => any,
        },
      },
      mock?: any,
    } = {},
  ) {

    this.group = group;
    this.state.set(!environment.production ? options?.mock : null);

    this.reset(true);
    this._init();
    this._initSubscriptions();
    this.state.set(this.group.getRawValue());
    this.group.markAsPristine();
    this.group.markAsUntouched();
  }

  /* -------------------- */

  private _init() {
    if (this.options.onInit) {
      this.options.onInit(this);
    }
  }

  private _initSubscriptions() {
    if (this.options.onInitSubscriptions) {
      this.options.onInitSubscriptions(this);
    }
  }

  submit() {
    if (this.options.onSubmit) {
      this.options.onSubmit();
    }
  }

  /* -------------------- */

  persist(value: any = {}) {
    this.state.persist({
      ...this.group.getRawValue(),
      ...value
    });

    this.restore();
  }

  set(value: any) {
    this.state.set({
      ...this.group.getRawValue(),
      ...value
    });

    this.restore();
  }

  restore(withInit?: boolean): void {
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

  getCombo$(key: string): any[] {
    return this.combos$()
      ? this.combos$()[key] || []
      : [];
  }

  getFromCombo(key: string, value: any[], multi: boolean = false) {
    const compareField: string = value[1];
    value = value[0];

    return this.combos
      ? (this.combos[key] || [])[multi ? 'filter' : 'find'](item => compareField ? item[compareField] === value : item === value)
      : null;
  }

  updateComboByTags(key: string, control: FormControl | string) {
    if (typeof control === 'string') {
      control = this.group.get(control) as FormControl;
    }

    control.valueChanges.subscribe(value => {
      const controlValue = value.map((tag: any) => {
        tag = typeof tag === 'string' ? { value: tag, name: tag } : tag;

        this.combos$.update(combos => {
          if (!combos[key].some(item => item.value === tag.value)) {
            combos[key].push(tag);
          }

          return combos;
        });

        return tag;
      });

      (control as FormControl).setValue(controlValue, { emitEvent: false });
    });
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

  isFormRequest(type?: TRequestType): boolean {
    switch (type) {
      case 'data':
      case 'combos':
      case 'upload': return false;
      default: return true;
    }
  }

  getRequest(type?: TRequestType): RequestHandler {
    switch (type) {
      case 'data': return this.dataRequestH;
      case 'combos': return this.combosRequestH;
      case 'upload': return this.uploadRequestH;
      default: return this.requestH;
    }
  }

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

  getGroup(key: string): FormGroup {
    return this.castFG(this.group.get(key));
  }

  getControl(key: string): FormControl {
    return this.castFC(this.group.get(key));
  }

  getArray(key: string): FormArray {
    return this.castFA(this.group.get(key));
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

  getError(key: string, group?: FormGroup): string {
    group = group || this.group;
    return group.get(key)?.getError('error');
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
          control.setErrors({ error: errors[key] });
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
      (this.options.arrays[groupArrayKey].onAdd as Function)(group, this);
    }

    control.push(group);
    control.markAsDirty();
  }

  addInit(control: FormArray | string, n: number, groupArrayKey: string = ''): void {
    this.remove(control);
    this.addN(control, n, groupArrayKey);
  }

  addN(control: FormArray | string, n: number, groupArrayKey: string = ''): void {
    for (let index = 0; index < n; index++) {
      this.add(control, groupArrayKey);
    }
  }

  remove(control: FormArray | string, index?: number): void {
    if (typeof control === 'string') {
      control = this.group.get(control) as FormArray;
    }

    if (typeof index === 'undefined') {
      while (control.controls.length) {
        control.removeAt(0);
      }
    } else {
      control.removeAt(index);
    }

    control.markAsDirty();
  }

  move(control: FormArray | string, index: number, value: 'left' | 'right' | number, groupArrayKey: string = ''): void {
    if (!this.options.arrays) {
      return;
    }

    if (typeof control === 'string') {
      groupArrayKey = control;
      control = this.group.get(groupArrayKey) as FormArray;
    }

    let indexesToMove: number;

    switch (value) {
      case 'left': indexesToMove = -1; break;
      case 'right': indexesToMove = 1; break;
      default: indexesToMove = value; break;
    }

    const controlsSpliced = control.controls.splice(index, 1)[0];
    control.controls.splice(index - indexesToMove, 0, controlsSpliced);

    control.markAsDirty();
    control.updateValueAndValidity();

    if (this.options.arrays[groupArrayKey].onMove) {
      for (let [index, value] of control.controls.entries()) {
        (this.options.arrays[groupArrayKey].onMove as any)(value, index);
      }
    }
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

  prepare(
    group?: FormGroup | FormArray,
    options?: {
      strict?: boolean,
      mustResetErrors?: boolean
    },
  ): {
    status: boolean,
    reason?: FormUnpreparedReasonEnum
  } {
    const defaultOptions = {
      strict: typeof options?.strict !== 'undefined' ? options?.strict : false,
      mustResetErrors: typeof options?.mustResetErrors !== 'undefined' ? options?.mustResetErrors : true,
    };

    const formGroup = group || this.group;

    this.validate(formGroup);

    if (this.requestH.isLoading()) {
      return {
        status: false,
        reason: FormUnpreparedReasonEnum.IS_LOADING,
      };
    }

    if (defaultOptions?.strict) {
      if (this.requestH.isSuccess() && formGroup.pristine) {
        return {
          status: false,
          reason: FormUnpreparedReasonEnum.IS_SUCCESS_AND_PRISTINE,
        };
      }
    }

    if (formGroup.invalid) {
      return {
        status: false,
        reason: FormUnpreparedReasonEnum.IS_INVALID,
      };
    };

    if (defaultOptions?.mustResetErrors) {
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
      request?: TRequestType,
      prepareOptions?: {
        strict?: boolean,
        mustResetErrors?: boolean
      },
      unprepared?: (reason: FormUnpreparedReasonEnum) => void,
      before?: () => void,
      success?: (res: IHttpResponse, notify: NzNotificationService) => void,
      error?: (err: IHttpErrorResponse, notify: NzNotificationService) => void,
      after?: () => void,
      reset?: boolean,
      persist?: boolean,
      notify?: boolean,
      notifySuccess?: boolean | [title: string, content: string],
      notifyError?: boolean | [title: string, content: string],
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
    };

    const requestH = this.getRequest(options?.request);

    if (this.isFormRequest(options?.request)) {
      const prepare = options?.prepareOptions
        ? this.prepare(undefined, options?.prepareOptions)
        : this.prepare();

      if (!environment.production) {
        console.log(prepare);
      }

      if (!prepare.status && prepare.reason) {
        if (defaultOptions.unprepared) {
          defaultOptions.unprepared(prepare.reason);
        }

        return of();
      }
    }

    if (defaultOptions.before) {
      defaultOptions.before();
    }

    return requestH.send(observable).pipe(
      tap({
        next: (res: IHttpResponse) => {
          if (defaultOptions.reset) {
            this.reset();
          } else if (defaultOptions.persist) {
            this.state.persist();
          }

          if (defaultOptions.notify || defaultOptions.notifySuccess) {
            let title: string = '¡Perfecto!';
            let content: string = res.message || 'Su solicitud ha sido enviada con éxito.';

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
            defaultOptions.success(res, this._nzNotificationS);
          }
        },
        error: (err: IHttpErrorResponse) => {
          this.setErrors(err.validation);

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
            defaultOptions.error(err, this._nzNotificationS);
          }
        },
        complete: () => {
          if (defaultOptions.after) defaultOptions.after();
        },
      }),
    );
  }
}
