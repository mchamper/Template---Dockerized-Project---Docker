import { FormControl } from "@angular/forms";

export const formValidatorMessages: { [key: string]: string | ((...params: any) => string) } = {
  required: 'Este campo es obligatorio.',
  email: 'Este campo debe ser un email válido.',
  mask: (mask: string) => {
    // return `Este campo debe tener un formato válido: ${mask}.`
    return `Este campo debe tener un formato válido.`
  },
  /* -------------------- */
  _email: 'Este campo debe ser un email válido.',
}

/* -------------------- */

export class FormValidators {

  static email(control: FormControl<string>): { [key: string]: boolean } {
    const regex = /(.+)@(.+)\.(.{2,})/;

    if (!!control.value && !regex.test(control.value)) {
      return { _email: true };
    }

    return {};
  }
};
