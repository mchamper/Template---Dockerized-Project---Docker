import { AbstractControl, ValidationErrors } from "@angular/forms";
import moment from "moment";

export const formValidatorMessages: { [key: string]: string | ((...params: any) => string) } = {
  required: 'core.form.validators.required',
  email: 'core.form.validators.email',
  pattern: `core.form.validators.pattern`,
  mask: (mask: string) => {
    return `core.form.validators.mask`;
  },
  maxlength: (length: number) => {
    return `core.form.validators.max_length`;
  },
  min: (min: number) => {
    return `core.form.validators.min`;
  },
  max: (max: number) => {
    return `core.form.validators.max`;
  },
  /* -------------------- */
  _email: 'core.form.validators.email',
  _arrayRequired: 'core.form.validators.required',
  _luhn: 'core.form.validators._luhn',
  _creditCardExpirationDate: 'core.form.validators._credit_card_expiration_date',
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

  /* -------------------- */

  static luhn(control: AbstractControl): ValidationErrors | null {
    const fn = (number: string): boolean => {
      if (!number.length) {
        return false;
      }

      // Remove all whitespaces from card number.
      number = number.replace(/\s/g, '');

      // 1. Remove last digit;
      const lastDigit = Number(number[number.length - 1]);

      // 2. Reverse number
      const numberReversed = number
        .slice(0, number.length - 1)
        .split('')
        .reverse()
        .map(x => Number(x));

      let sum = 0;

      // 3. Multiply by 2 every digit on odd position.
      for (let i = 0; i <= numberReversed.length - 1; i += 2) {
        numberReversed[i] = numberReversed[i] * 2;

        // 4. Subtract 9 if digit > 9
        if (numberReversed[i] > 9) {
          numberReversed[i] = numberReversed[i] - 9;
        }
      }

      // 5. Make the sum of obtained values from step 4.
      sum = numberReversed.reduce((previousValue, currentValue) => (previousValue + currentValue), 0);

      // 6. Calculate modulo 10 of the sum from step 5 and the last digit. If it's 0, you have a valid number.
      return ((sum + lastDigit) % 10 === 0);
    };

    return fn(control.value) ? null : { _luhn: true };
  }

  /* -------------------- */

  static creditCardExpirationDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    let inputDate: string = (control.value || '').replace('/', '');

    if (inputDate.length === 4) {
      inputDate = `${inputDate.slice(0, 2)}/20${inputDate.slice(2)}`;
    }

    if (inputDate.length === 6) {
      inputDate = `${inputDate.slice(0, 2)}/${inputDate.slice(2)}`;
    }

    const date = moment(inputDate, 'MM/YYYY');

    if (!date.isValid() || moment().format('YYYY-MM') > date.format('YYYY-MM')) {
      return { _creditCardExpirationDate: true };
    }

    return null;
  }
};
