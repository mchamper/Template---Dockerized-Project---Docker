import { Injector, ProviderToken, inject, signal } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CombosHttpService } from "../../../services/http/combos-http.service";
import { Request } from "../request/request.class";
import { environment } from "../../../../environments/environment";
import { debounceTime, distinctUntilChanged, skip } from "rxjs";
import { cloneDeep, entries, isArray } from "lodash";
import { logger } from "../../utils/helpers/logger.helper";
import { StorageService } from "../../services/storage.service";
import { md5 } from "../../utils/helpers/hash.helper";

export class Form<Data = any> {

  private _storageS = this._inject(StorageService);
  private _combosHttpS = this._inject(CombosHttpService);

  state = {
    init: signal<any>(null),
    current: signal<any>(null),
    get: (): any => {
      return this.state.current() || this.state.init();
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

  request = new Request({ type: 'form', injector: this._options.injector });
  dataRequest = new Request<Data>({ injector: this._options.injector });
  combosRequest = new Request({ injector: this._options.injector });
  actionRequest = new Request({ injector: this._options.injector });

  extraGroup = new FormGroup<any>({});

  combos = signal<{ [key: string]: any[] }>({});

  isSettingData = signal(false);

  constructor(
    public group: FormGroup = new FormGroup({}),
    private _options: {
      init?: (form: Form) => any,
      subscriptions?: (form: Form) => any,
      arrays?: {
        [key: string]: {
          group: FormGroup,
          onAdd?: (group: FormGroup, form: Form) => any,
          onMove?: (eachControl: FormControl, newIndex: number) => any,
        },
      },
      request?: Request['_options'],
      dataRequest?: Request['_options'],
      combos?: string | { [key: string]: any[] },
      reset?: boolean,
      persist?: boolean,
      autoSave?: boolean,
      mock?: any,
      injector?: Injector,
    } = {},
  ) {

    this._options = {
      ...this._options,
    };

    this._createRequests();

    this.state.set(!environment.production ? this._options?.mock : null);
    this.reset(true);

    this._init();
    this._subscriptions();

    this.state.set(this.group.getRawValue());
    this.group.markAsPristine();
    this.group.markAsUntouched();

    this._initAutoSave();
  }

  private _inject<T = any>(token: ProviderToken<T>) {
    return this._options.injector?.get(token) || inject(token);
  }

  /* -------------------- */

  private _createRequests() {
    if (this._options.request) {
      this.request = new Request({
        ...this._options.request,
        when: () => {
          this.validate();
          logger(`Form valid status: ${this.group.valid}`);

          return this.group.valid;
        },
        success: (httpRes) => {
          this.cleanErrors();

          if (this._options.reset) {
            this.reset();
          } else if (this._options.persist) {
            this.state.persist();
          }

          if (this._options.request!.success) {
            this._options.request!.success(httpRes);
          }
        },
        error: (httpError) => {
          this.setApiErrors(httpError.validation);

          if (this._options.request!.error) {
            this._options.request!.error(httpError);
          }
        },
        type: 'form',
        injector: this._options.injector,
      });
    }

    if (this._options.dataRequest) {
      this.dataRequest = new Request({
        ...this._options.dataRequest,
        injector: this._options.injector,
      });
    }

    if (this._options.combos) {
      if (typeof this._options.combos === 'string') {
        this.combosRequest = new Request({
          send: () => this._combosHttpS.get(this._options.combos as string),
          success: (res) => {
            this.combos.update(value => {
              return {
                ...value,
                ...res.body.combos,
              }
            });
          },
          injector: this._options.injector,
        });

        this.combosRequest.run();
      } else {
        this.combos.set(this._options.combos);
      }
    }
  }

  /* -------------------- */

  private _initAutoSave() {
    const formKey = `form.${md5(this.state.init())}`;

    if (this._options.autoSave) {
      const autoSaveValueStored = this._storageS.get(formKey, { base64: true });

      if (autoSaveValueStored) {
        this.group.setValue(autoSaveValueStored, { emitEvent: false });

        if (`form.${md5(autoSaveValueStored)}` !== formKey) {
          this.group.markAsDirty();
          this.group.markAsTouched();
        }
      }

      this.group.valueChanges.pipe(
        debounceTime(300),
      ).subscribe(() => {
        this._storageS.set(formKey, this.group.getRawValue(), { base64: true });
      });
    } else {
      this._storageS.clear(formKey);
    }
  }

  /* -------------------- */

  private _init() {
    if (this._options.init) {
      this._options.init(this);
    }
  }

  private _subscriptions() {
    this.group.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(301),
    ).subscribe(() => {
      this.isSettingData.set(false);
    });

    if (this._options.subscriptions) {
      this._options.subscriptions(this);
    }
  }

  changes(key: string, skips: number = 0) {
    return this.group.get(key)!.valueChanges.pipe(
      takeUntilDestroyed(),
      // debounceTime(0),
      distinctUntilChanged(),
      skip(skips),
    );
  }

  submit() {
    this.request.run();
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
    this.isSettingData.set(true);

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

  reset(withInit?: boolean, options?: any): void {
    this.group.reset(withInit ? this.state.init() : this.state.get(), options);
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

    control.valueChanges.pipe(
      takeUntilDestroyed(),
    ).subscribe(value => {
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

      if (isArray(value)) {
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

  getControls(): { name: string, control: FormControl }[] {
    return entries(this.group.controls).map(item => { return { name: item[0], control: this.asFC(item[1]) } });
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

  cleanErrors(options?: any): void {
    this.group.reset(this.group.getRawValue(), options);
  }

  /* -------------------- */

  addArray(control: FormArray | string, groupArrayKey: string = ''): void {
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

  addArrays(control: FormArray | string, times: number, groupArrayKey: string = ''): void {
    for (let index = 0; index < times; index++) {
      this.addArray(control, groupArrayKey);
    }
  }

  setArrays(control: FormArray | string, times: number, groupArrayKey: string = ''): void {
    this.removeArray(control);
    this.addArrays(control, times, groupArrayKey);
  }

  removeArray(control: FormArray | string, index?: number): void {
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

  moveArray(control: FormArray | string, index: number, value: 'left' | 'right' | number, groupArrayKey: string = ''): void {
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

  isValueUsedInArray(control: FormArray | string, key: string, value: any): boolean {
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
}
