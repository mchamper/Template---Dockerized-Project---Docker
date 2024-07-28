import { signal } from "@angular/core";
import { _Form } from "./form.class";

export function FormState<TBase extends new (...args: any[]) => _Form>(Base: TBase) {
  return class FormState extends Base {

    state = {
      live: signal<any>(''),
      init: signal<any>(''),
      current: signal<any>(''),
    }

    constructor(...args: any[]) {
      super();
    }
  };
}

