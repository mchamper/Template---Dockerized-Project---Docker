import { FormControl, FormGroup } from "@angular/forms";
import { Request } from "../request/classes/request.class";
import { _Form, Form } from "./classes/form.class";

export const createForm = <
  GFormGroup extends FormGroup = FormGroup,
  GRequest extends Request = Request,
  GDataRequest extends Request = Request,
  GParams = { [key: string]: unknown },
>(
  config: _Form<GFormGroup, GRequest, GDataRequest, GParams>['_config'],
  options?: _Form['_options'],
) => new Form(config, options);

export const createDefaultForm = <
  GFormGroup extends FormGroup = FormGroup,
  GRequest extends Request = Request,
  GDataRequest extends Request = Request,
  GParams = { [key: string]: unknown },
>(
  config?: Omit<_Form<GFormGroup, GRequest, GDataRequest, GParams>['_config'], 'group'>,
  options?: _Form['_options'],
) => {
  return new Form({
    ...config,
    group: new FormGroup({
      default: new FormControl<any>('default'),
    }),
  }, options);
};
