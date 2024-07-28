import { FormControl, FormGroup } from "@angular/forms";
import { Form } from "./classes/form.class";
import { Request } from "../request/classes/request.class";

export const createForm = <
  GFormGroup extends FormGroup,
  GRequest extends Request,
  GDataRequest extends Request,
  GParams,
>(
  config: Form<GFormGroup, GRequest, GDataRequest, GParams>['_config'],
  options?: Form['_options'],
) => {
  return new Form(config, options);
};

export const createDefaultForm = <
  GFormGroup extends FormGroup,
  GRequest extends Request,
  GDataRequest extends Request,
  GParams,
>(
  config?: Omit<Form<GFormGroup, GRequest, GDataRequest, GParams>['_config'], 'group'>,
  options?: Form['_options'],
) => {
  return new Form({
    ...config,
    group: new FormGroup({
      default: new FormControl<any>('default'),
    }),
  }, options);
};
