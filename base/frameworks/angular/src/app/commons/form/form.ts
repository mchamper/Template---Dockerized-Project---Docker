/** version: 2 */

import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { cloneDeep, isDate } from "lodash";
import { Request } from "../request";
import { formErrorMessages } from "./form-validators";
import * as moment from "moment";

export class Form {

  state: {
    init: any,
    current: any,
    get: () => any,
    set: (value?: any) => void,
    persist: (value?: any) => void,
  } = {
    init: null,
    current: null,
    get: (): any => this.state.current || this.state.init,
    set: (value?: any): void => this.state.init = cloneDeep(value || this.group.getRawValue()),
    persist: (value?: any): void => this.state.current = cloneDeep(value || this.group.getRawValue()),
  };

  groupInit!: FormGroup;
  combos!: { [key: string]: any[] };

  request: Request = new Request();
  dataRequest: Request = new Request();
  combosRequest: Request = new Request();

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
    } = {},
  ) {

    this.state.set();
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
    this.state.persist(value);
    this.restore();
  }

  restore(withInit?: boolean): void {
    if (withInit) {
      this.state.current = null;
    }

    this.group = cloneDeep(this.groupInit);
    this._init();

    this.reset();
  }

  /* -------------------- */

  patch(withInit?: boolean, options?: any): void {
    this.group.patchValue(withInit ? this.state.init : this.state.get(), options);
  }

  reset(withInit?: boolean, options?: any): void {
    this.group.reset(withInit ? this.state.init : this.state.get(), options);
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

  /* -------------------- */

  getValuesForQueryParams(): any {
    const prefix: string = 'filters:';
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

  setValuesFromQueryParams(queryParams: { [key: string]: string }): void {
    const prefix: string = 'filters:';
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

    this.state.set({ ...this.state.get(), ...formValues });
    this.reset(true);
  }

  /* -------------------- */

  getLocalError(key: string): string {
    for (const errorKey in this.group.get(key)?.errors) {
      return formErrorMessages[errorKey];
    }

    return '';
  }

  getError(key: string, localFirst?: boolean): string {
    const error = this.group.get(key)?.getError('apiError');

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
}
