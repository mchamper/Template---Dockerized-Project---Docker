import { Request } from "../../request/classes/request.class";
import { Form } from "./form.class";
import { FormControl, FormGroup } from "@angular/forms";

export const createForm = <
  GFormGroup = FormGroup,
  GRequest = Request,
  GDataRequest = Request,
  GParams = { [key: string]: unknown },
>(
  config: Form<GFormGroup, GRequest, GDataRequest, GParams>['_config'],
  options?: Form['_options'],
) => new Form(config, options);

export const createDefaultForm = <
  GFormGroup = FormGroup,
  GRequest = Request,
  GDataRequest = Request,
  GParams = { [key: string]: unknown },
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
