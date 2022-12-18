import { FormControl } from "@angular/forms";
import { replace } from "lodash";

export const formValidatorMessages: { [key: string]: string | ((...params: any) => string) } = {
  required: 'Este campo es obligatorio.',
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

    if (!regex.test(control.value)) {
      return { _email: true };
    }

    return {};
  }
};
