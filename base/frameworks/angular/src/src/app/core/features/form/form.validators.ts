import { inject } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

export const formValidatorMessages: { [key: string]: string | ((...params: any) => string) } = {
  required: 'core.form.validators.required',
  email: 'core.form.validators.email',
  pattern: `core.form.validators.pattern`,
  mask: (mask: string) => {
    // return `Este campo debe tener un formato válido: ${mask}.`
    return `core.form.validators.mask`
  },
  maxlength: (length: number) => {
    return `core.form.validators.max_length`
    // return 'Este campo supera los caracteres permitidos.'
  },
  max: (max: number) => {
    return `core.form.validators.max`
    // return 'Este campo supera los caracteres permitidos.'
  },
  /* -------------------- */
  _email: 'Este campo debe ser un email válido.',
  _arrayRequired: 'Este campo es obligatorio.',
}

/* -------------------- */

export class FormValidators {

  private _translateS = inject(TranslateService);

  static email(control: AbstractControl): ValidationErrors | null {
    const regex = /(.+)@(.+)\.(.{2,})/;

    if (!!control.value && !regex.test(control.value)) {
      return { _email: true };
    }

    return null;
  }

  /* -------------------- */

  static arrayRequired(control: AbstractControl): ValidationErrors | null {
    if (!control.value?.length) {
      return { _arrayRequired: true };
    }

    return null;
  }
};
