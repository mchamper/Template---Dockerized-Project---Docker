import { AbstractFeature } from "../../../abstract-feature.class";
import { SsrService } from "../../../../services/ssr.service";
import { StorageService } from "../../../../../services/storage.service";
import { CombosHttpService } from "../../../../../services/http/general/combos-http.service";
import { FormGroup } from "@angular/forms";
import { Request } from "../../request/classes/request.class";
import { FormState } from "./form-state.class";
import { FormRequest } from "./form-request";

export class _Form<
  GFormGroup extends FormGroup = FormGroup,
  GRequest extends Request = Request,
  GDataRequest extends Request = Request,
  GParams = { [key: string]: unknown },
> extends AbstractFeature {

  private _ssrS = this._inject(SsrService);
  private _storageS = this._inject(StorageService);
  private _combosHttpS = this._inject(CombosHttpService);

  constructor(
    protected _config: {
      group: GFormGroup,
      request?: GRequest,
      dataRequest?: GDataRequest,
      params?: GParams,
    },
    options?: AbstractFeature['_options'],
  ) {
    super(options);

    this._config = {
      ...this._config,
    };
  }

  get group() {
    return this._config.group;
  }

  get params() {
    return this._config.params;
  }
}

/* -------------------- */
/* -------------------- */
/* -------------------- */

export const Form = FormState(FormRequest(_Form));
