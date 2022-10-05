import { FormControl } from "@angular/forms";

export let formErrorMessages: { [key: string]: string } = {
  required: 'Este campo es obligatorio.',
  _validEmail: 'Este campo debe ser un email válido.',
}

/* -------------------- */

export const formValidEmailValidator = (control: FormControl<string>): { [key: string]: boolean } => {
  if (control.value?.indexOf('@') < 0) {
    return { _validEmail: true };
  }

  return {};
};
