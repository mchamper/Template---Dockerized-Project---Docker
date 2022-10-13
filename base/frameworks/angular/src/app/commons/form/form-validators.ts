import { FormControl } from "@angular/forms";

export const formValidatorMessages: { [key: string]: string } = {
  required: 'Este campo es obligatorio.',
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
