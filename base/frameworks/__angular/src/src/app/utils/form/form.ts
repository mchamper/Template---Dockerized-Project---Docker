import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { cloneDeep, get, isDate } from "lodash";
import { Observable, Subscription, debounceTime, distinctUntilChanged, of, skip, tap } from "rxjs";
import * as moment from "moment";
import { IHttpErrorResponse } from "src/app/interceptors/error.interceptor";
import { Injector, ProviderToken, inject, signal } from "@angular/core";
import { environment } from "src/environments/environment";
import { IHttpResponse } from "src/app/interceptors/success.interceptor";
import { Request } from "../request/request";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CombosHttpService } from "src/app/services/http/combos-http.service";

interface FormPrepareOptions {
  strict?: boolean,
  mustResetErrors?: boolean,
}

export enum FormUnpreparedReasonEnum {
  IS_LOADING = 'IS_LOADING',
  IS_PRISTINE = 'IS_PRISTINE',
  IS_INVALID = 'IS_INVALID',
}

export class Form<Data = any> {

  state = {
    init: signal<any>(null),
    current: signal<any>(null),
    get: (): any => {
      return this.state.current()
        ? this.state.current()
        : this.state.init();
    },
    set: (value?: any): void => {
      const newValue = cloneDeep(value || this.group.getRawValue());

      this.state.init.set(newValue);
      this.state.current.set(newValue);
    },
    persist: (value?: any): void => {
      const newValue = cloneDeep(value || this.group.getRawValue());
      this.state.current.set(newValue);
    },
  };

  group: FormGroup;
  combos = signal<{ [key: string]: any[] }>({});

  request = new Request({ type: 'form', injector: this._options.injector });
  actionRequest = new Request({ injector: this._options.injector });
  dataRequest = new Request<Data>({ injector: this._options.injector });
  combosRequest = new Request({ injector: this._options.injector });

  private _combosHttpS = this._inject(CombosHttpService);

  constructor(
    group: FormGroup = new FormGroup({}),
    private _options: {
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
      combos?: string | { [key: string]: any[] },
      dataRequest?: Request['_options'],
      request?: {
        prepare?: FormPrepareOptions,
        reset?: boolean,
        persist?: boolean,
      } & Request['_options'],
      injector?: Injector,
      mock?: any,
    } = {},
  ) {

    this.group = group;
    this.state.set(!environment.production ? this._options?.mock : null);

    this.reset(true);
    this._init();
    this._initSubscriptions();
    this.state.set(this.group.getRawValue());
    this.group.markAsPristine();
    this.group.markAsUntouched();

    if (this._options.combos) {
      if (typeof this._options.combos === 'string') {
        this.combosRequest = new Request({
          send: () => this._combosHttpS.get(this._options.combos as string),
          body: 'combos',
          success: () => {
            this.combos.set(this.combosRequest.body());
          },
          injector: this._options.injector,
        });

        this.combosRequest.run();
      } else {
        this.combos.set(this._options.combos);
      }
    }

    if (this._options.dataRequest) {
      this.dataRequest = new Request({
        ...this._options.dataRequest,
        injector: this._options.injector,
      });

      this.dataRequest.run();
    }

    if (this._options.request) {
      this.request = new Request({
        ...this._options.request,
        type: 'form',
        injector: this._options.injector,
      });
    }
  }

  /* -------------------- */

  private _inject<T = any>(token: ProviderToken<T>) {
    return this._options.injector?.get(token) || inject(token);
  }

  /* -------------------- */

  private _init() {
    if (this._options.onInit) {
      this._options.onInit(this);
    }
  }

  private _initSubscriptions() {
    if (this._options.onInitSubscriptions) {
      this._options.onInitSubscriptions(this);
    }
  }

  changes(key: string, skips: number = 0) {
    return this.group.get(key)?.valueChanges.pipe(
      debounceTime(0),
      distinctUntilChanged(),
      skip(skips),
    );
  }

  submit() {
    if (this._options.onSubmit) {
      this._options.onSubmit();
    } else {
      this.run();
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
      this.state.current.set(null);
    }

    this.reset();
    this.request.reset();

    this.group.markAsPristine();
  }

  /* -------------------- */

  reset(withInit?: boolean, options?: any): void {
    this.group.reset(withInit ? this.state.init() : this.state.get(), options);
  }

  resetErrors(options?: any): void {
    this.group.reset(this.group.getRawValue(), options);
  }

  /* -------------------- */

  getCombo(key: string): any[] {
    return this.combos()
      ? this.combos()[key] || []
      : [];
  }

  getFromCombo(key: string, value: any[], multi: boolean = false) {
    const compareField: string = value[1];
    value = value[0];

    return this.combos()
      ? (this.combos()[key] || [])[multi ? 'filter' : 'find'](item => compareField ? item[compareField] === value : item === value)
      : null;
  }

  updateComboWithNewTags(key: string, control: FormControl | string) {
    if (typeof control === 'string') {
      control = this.group.get(control) as FormControl;
    }

    control.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      const controlValue = value.map((tag: any) => {
        tag = typeof tag === 'string' ? { value: tag, name: tag } : tag;

        this.combos.update(combos => {
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

  getRequests(): Request[] {
    return [
      this.request,
      this.dataRequest,
      this.combosRequest,
      this.actionRequest,
    ];
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

  getGroup(key: string): FormGroup {
    return this.asFG(this.group.get(key));
  }

  getControl(key: string): FormControl {
    return this.asFC(this.group.get(key));
  }

  getArray(key: string): FormArray {
    return this.asFA(this.group.get(key));
  }

  /* -------------------- */

  getQueryParamsFromValues(prefix: string = ''): any {
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
    return group.get(key)?.getError('localError') || group.get(key)?.getError('apiError');
  }

  setApiErrors(errors: any = null): void {
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

  arrayAdd(control: FormArray | string, groupArrayKey: string = ''): void {
    if (!this._options.arrays) {
      return;
    }

    if (typeof control === 'string') {
      groupArrayKey = control;
      control = this.group.get(groupArrayKey) as FormArray;
    }

    const group = cloneDeep(this._options.arrays[groupArrayKey].group);

    control.push(group);
    control.markAsDirty();

    if (this._options.arrays[groupArrayKey].onAdd) {
      (this._options.arrays[groupArrayKey].onAdd as Function)(group, this);
    }
  }

  arrayAddN(control: FormArray | string, n: number, groupArrayKey: string = ''): void {
    for (let index = 0; index < n; index++) {
      this.arrayAdd(control, groupArrayKey);
    }
  }

  addInit(control: FormArray | string, n: number, groupArrayKey: string = ''): void {
    this.arrayRemove(control);
    this.arrayAddN(control, n, groupArrayKey);
  }

  arrayRemove(control: FormArray | string, index?: number): void {
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

  arrayMove(control: FormArray | string, index: number, value: 'left' | 'right' | number, groupArrayKey: string = ''): void {
    if (!this._options.arrays) {
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

    if (this._options.arrays[groupArrayKey].onMove) {
      for (let [index, value] of control.controls.entries()) {
        (this._options.arrays[groupArrayKey].onMove as Function)(value, index);
      }
    }
  }

  arrayCheckValueInUse(control: FormArray | string, key: string, value: any): boolean {
    if (typeof control === 'string') {
      control = this.group.get(control) as FormArray;
    }

    return control.controls.some(item => item.get(key)?.value === value);
  }

  /* -------------------- */

  asFC(control: AbstractControl | null): FormControl {
    return control as FormControl;
  }

  asFG(control: AbstractControl | null): FormGroup {
    return control as FormGroup;
  }

  asFA(control: AbstractControl | null): FormArray {
    return control as FormArray;
  }

  /* -------------------- */

  prepare(
    group?: FormGroup | FormArray,
    options?: FormPrepareOptions,
  ): {
    status: boolean,
    reason?: FormUnpreparedReasonEnum
  } {
    options = {
      strict: get(options, 'strict', false),
      mustResetErrors: get(options, 'mustResetErrors', true),
    };

    const formGroup = group || this.group;

    if (this.request.isLoading()) {
      return {
        status: false,
        reason: FormUnpreparedReasonEnum.IS_LOADING,
      };
    }

    if (options?.strict) {
      if (formGroup.pristine) {
        return {
          status: false,
          reason: FormUnpreparedReasonEnum.IS_PRISTINE,
        };
      }
    }

    this.validate(formGroup);

    if (formGroup.invalid) {
      return {
        status: false,
        reason: FormUnpreparedReasonEnum.IS_INVALID,
      };
    };

    if (options?.mustResetErrors) {
      this.resetErrors();
    }

    return {
      status: true
    };
  }

  validate(group?: FormGroup | FormArray): void {
    const formGroup = group || this.group;

    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key)!;

      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        this.validate(abstractControl);
      } else {
        if (!abstractControl.getError('apiError')) {
          const isPreviouslyDisabled = abstractControl.disabled;

          if (isPreviouslyDisabled) {
            abstractControl.enable({ onlySelf: true, emitEvent: false });
          }

          abstractControl.markAsTouched();
          abstractControl.updateValueAndValidity({ onlySelf: true });

          if (isPreviouslyDisabled) {
            abstractControl.disable({ onlySelf: true, emitEvent: false });
          }
        }
      }
    });
  }

  /* -------------------- */

  send(...params: any): Observable<IHttpResponse> {
    const options = {
      ...this._options.request,
      reset: get(this._options.request, 'reset', false),
      persist: get(this._options.request, 'persist', false),
    };

    const isPrepared = options?.prepare
      ? this.prepare(undefined, options.prepare)
      : this.prepare();

    if (!environment.production) {
      console.log('Form prepared:', isPrepared);
    }

    if (!isPrepared.status && isPrepared.reason) {
      return of();
    }

    return this.request.send(params).pipe(
      tap({
        next: (res: IHttpResponse) => {
          if (options?.reset) {
            this.reset();
          } else if (options?.persist) {
            this.state.persist();
          }
        },
        error: (err: IHttpErrorResponse) => {
          this.setApiErrors(err.validation);
        },
      }),
    );
  }

  run = (...params: any): Subscription => {
    return this.send(...params).subscribe();
  }
}
