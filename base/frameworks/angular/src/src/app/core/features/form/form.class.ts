import { DestroyRef, Injector, ProviderToken, inject, signal } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CombosHttpService } from "../../../services/http/general/combos-http.service";
import { Request } from "../request/request.class";
import { environment } from "../../../../environments/environment";
import { debounceTime, distinctUntilChanged, skip, startWith } from "rxjs";
import { cloneDeep, entries, isArray } from "lodash";
import { logger } from "../../utils/helpers/logger.helper";
import { StorageService } from "../../../services/storage.service";
import { md5 } from "../../utils/helpers/hash.helper";
import { SsrService } from "../../services/ssr.service";

export class Form<GFormGroup extends FormGroup = any, Data = any> {

  private _ssrS: SsrService;
  private _storageS: StorageService;
  private _combosHttpS: CombosHttpService;

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

  autoSaveState = {
    key: signal(''),
    value: signal<any>(null),
  };

  request: Request;
  dataRequest: Request<Data>;
  combosRequest: Request;
  actionRequest: Request;

  extraGroup = new FormGroup<any>({});

  combos = signal<{ [key: string]: any[] }>({});

  isSettingData = signal(false);

  constructor(
    public group: GFormGroup = new FormGroup({}) as any,
    private _options: {
      init?: (form: Form<GFormGroup, Data>, state: any) => any,
      subscriptions?: (form: Form<GFormGroup, Data>) => any,
      arrays?: {
        [key: string]: {
          group: FormGroup,
          onAdd?: (group: FormGroup, form: Form<GFormGroup, Data>, state: any) => any,
          onMove?: (eachControl: FormControl, newIndex: number) => any,
        },
      },
      request?: Request['_options'],
      dataRequest?: Request['_options'],
      combos?: string | { [key: string]: any[] },
      comboMap?: (combos: any) => any,
      reset?: boolean,
      persist?: boolean,
      autoSave?: boolean,
      mock?: any,
      injector?: Injector,
    } = {},
  ) {

    this._options = {
      ...this._options,
      autoSave: this._options.dataRequest ? false : this._options.autoSave,
    };

    this._ssrS = this._inject(SsrService);
    this._storageS = this._inject(StorageService);
    this._combosHttpS = this._inject(CombosHttpService);

    this.request = new Request({ type: 'form', injector: this._inject(Injector) });
    this.dataRequest = new Request<Data>({ injector: this._inject(Injector) });
    this.combosRequest = new Request({ injector: this._inject(Injector) });
    this.actionRequest = new Request({ injector: this._inject(Injector) });

    /* -------------------- */

    this.state.set(!environment.production ? this._options?.mock : null);
    this.reset(true, { emitEvent: false });

    this._restoreAutoSave();

    this._init();
    this._subscriptions();
    this.state.set(this.group.getRawValue());

    if (this._options.autoSave) {
      this._init(true);
    }

    this.group.markAsPristine();
    this.group.markAsUntouched();

    this._startAutoSave();

    this._createRequests();
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
          const defaultWhen = () => {
            this.validate();
            logger(`Form valid status: ${this.group.valid}`);

            return this.group.valid;
          };

          if (this._options.request!.when) {
            return this._options.request!.when() && defaultWhen();
          }

          return defaultWhen();
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

      this.dataRequest.run();
    }

    if (this._options.combos) {
      if (typeof this._options.combos === 'string') {
        this.combosRequest = new Request({
          send: () => this._combosHttpS.get(this._options.combos as string),
          success: (res) => {
            this.combos.update(value => {
              const combos = this._options.comboMap
                ? this._options.comboMap(res.body.combos)
                : res.body.combos;

              return {
                ...value,
                ...combos,
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

  private _restoreAutoSave() {
    if (!this._options.autoSave) return;

    this.autoSaveState.key.set(`form.${md5(this.state.init())}`);
    this.autoSaveState.value.set(this._storageS.get(this.autoSaveState.key()));
  }

  private async _startAutoSave() {
    if (this._ssrS.isServer()) return;

    if (!this._options.autoSave) {
      await this._storageS.remove(this.autoSaveState.key());
      return;
    };

    if (this.autoSaveState.value()) {
      this.group.setValue(this.autoSaveState.value());

      if (md5(this.autoSaveState.value()) !== md5(this.state.init())) {
        this.group.markAsDirty();
        this.group.markAsTouched();
      }
    }

    this.group.valueChanges.pipe(
      debounceTime(300),
    ).subscribe(async () => {
      this.autoSaveState.value.set(this.group.getRawValue());
      await this._storageS.set(this.autoSaveState.key(), this.autoSaveState.value());
    });
  }

  /* -------------------- */

  private _init(withAutoSave?: boolean) {
    if (this._options.init) {
      this._options.init(this, withAutoSave && this.autoSaveState.value()
        ? this.autoSaveState.value()
        : this.state.get());
    }
  }

  private _subscriptions() {
    this.group.valueChanges.pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
      debounceTime(301),
    ).subscribe(() => {
      this.isSettingData.set(false);
    });

    if (this._options.subscriptions) {
      this._options.subscriptions(this);
    }
  }

  changes(control: FormControl | string, skips: number = 0) {
    if (typeof control === 'string') {
      control = this.group.get(control)! as FormControl;
    }

    return control!.valueChanges.pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
      // distinctUntilChanged(),
      distinctUntilChanged((previous, current) => md5(previous) === md5(current)),
      startWith(control.value),
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

  set(value: any = {}) {
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
    this.group.patchValue(withInit ? this.state.init() : this.state.get(), { emitEvent: false });
    this.group.reset(this.group.getRawValue(), options);
  }

  resetOnly(groupKey: string, withInit?: boolean, options?: any): void {
    const stateValue = (withInit ? this.state.init() : this.state.get())[groupKey];
    this.getGroup(groupKey).reset(stateValue, options);
  }

  /* -------------------- */

  getCombo<T = any>(key: string): T[] {
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
      takeUntilDestroyed(this._inject(DestroyRef)),
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

  cancelRequests() {
    for (const request of this.getRequests()) {
      request.cancel();
    }
  }

  /* -------------------- */

  getValue(key: string, field?: string): any {
    let value = this.group.get(key)?.value;

    if (field) {
      const fields: string[] = field.split('|');

      if (isArray(value)) {
        return value.map((item: any) => {
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

  getControlsOf(control?: FormGroup | FormArray | string): { name: string, control: FormControl }[] {
    if (typeof control === 'string') {
      control = this.group.get(control) as FormGroup | FormArray;
    }

    if (!control) {
      control = this.group;
    }

    return entries(control.controls).map(item => { return { name: item[0], control: this.asFC(item[1]) } });
  }

  /* -------------------- */

  getError(key: string, group?: FormGroup): string {
    group = group || this.group;
    return group.get(key)?.getError('localError') || group.get(key)?.getError('apiError');
  }

  mustShowError(key: string, group?: FormGroup): boolean {
    group = group || this.group;
    return !!group.get(key)?.dirty && !!this.getError(key, group);
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

  addArray(control: FormArray | string, groupArrayName: string = ''): void {
    if (!this._options.arrays) {
      return;
    }

    if (typeof control === 'string') {
      groupArrayName = control;
      control = this.group.get(groupArrayName) as FormArray;
    }

    const group = cloneDeep(this._options.arrays[groupArrayName].group);

    if (this._options.arrays[groupArrayName].onAdd) {
      (this._options.arrays[groupArrayName].onAdd as Function)(group, this, this._options.autoSave && this.autoSaveState.value()
        ? this.autoSaveState.value()
        : this.state.get());
    }

    control.push(group);
    control.markAsDirty();
  }

  addArrays(control: FormArray | string, groupArrayName: string = '', times: number): void {
    for (let index = 0; index < times; index++) {
      this.addArray(control, groupArrayName);
    }
  }

  setArrays(control: FormArray | string, groupArrayName: string = '', times: number): void {
    this.removeArray(control);
    this.addArrays(control, groupArrayName, times);
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

  moveArray(control: FormArray | string, index: number, value: 'left' | 'right' | number, groupArrayName: string = ''): void {
    if (!this._options.arrays) {
      return;
    }

    if (typeof control === 'string') {
      groupArrayName = control;
      control = this.group.get(groupArrayName) as FormArray;
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

    if (this._options.arrays[groupArrayName].onMove) {
      for (let [index, value] of control.controls.entries()) {
        (this._options.arrays[groupArrayName].onMove as Function)(value, index);
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
      const abstractControl = (formGroup as any).get(key)!;

      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        this.validate(abstractControl);
      } else {
        if (!abstractControl.getError('apiError')) {
          // const isPreviouslyDisabled = abstractControl.disabled;

          // if (isPreviouslyDisabled) {
          //   abstractControl.enable({ onlySelf: true, emitEvent: false });
          // }

          abstractControl.markAsTouched();
          abstractControl.updateValueAndValidity({ onlySelf: true });

          // if (isPreviouslyDisabled) {
          //   abstractControl.disable({ onlySelf: true, emitEvent: false });
          // }
        }
      }
    });
  }
}
