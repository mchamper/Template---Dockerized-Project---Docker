import { AbstractControl, ValidationErrors } from "@angular/forms";

export const formValidatorMessages: { [key: string]: string | ((...params: any) => string) } = {
  required: 'Este campo es obligatorio.',
  email: 'Este campo debe ser un email válido.',
  mask: (mask: string) => {
    // return `Este campo debe tener un formato válido: ${mask}.`
    return `Este campo debe tener un formato válido.`
  },
  maxlength: (length: number) => {
    return `Este campo solo puede tener un máximo de ${length} caracteres.`
    // return 'Este campo supera los caracteres permitidos.'
  },
  max: (max: number) => {
    return `El número válido máximo para este campo es ${max}.`
    // return 'Este campo supera los caracteres permitidos.'
  },
  /* -------------------- */
  _email: 'Este campo debe ser un email válido.',
  _arrayRequired: 'Este campo es obligatorio.',
}

/* -------------------- */

export class FormValidators {

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
