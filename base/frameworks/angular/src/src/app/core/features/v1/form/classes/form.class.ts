import { AbstractFeature } from "../../../abstract-feature.class";
import { SsrService } from "../../../../services/ssr.service";
import { StorageService } from "../../../../../services/storage.service";
import { CombosHttpService } from "../../../../../services/http/general/combos-http.service";
import { FormControl, FormGroup } from "@angular/forms";
import { createDefaultRequest, Request } from "../../request/classes/request.class";

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

/* -------------------- */

export class Form<
  GFormGroup = FormGroup,
  GRequest = Request,
  GDataRequest = Request,
  GParams = { [key: string]: unknown },
> extends AbstractFeature {

  protected _config: {
    group: GFormGroup,
    request?: GRequest,
    dataRequest?: GDataRequest,
    params?: GParams,
  };

  private _ssrS = this._inject(SsrService);
  private _storageS = this._inject(StorageService);
  private _combosHttpS = this._inject(CombosHttpService);

  combosRequest = createDefaultRequest();
  actionRequest = createDefaultRequest();

  constructor(
    config: Form<GFormGroup, GRequest, GDataRequest, GParams>['_config'],
    options?: AbstractFeature['_options'],
  ) {
    super(options);

    this._config = {
      ...config,
    };

    this._createRequests();
  }

  get group() {
    return this._config.group;
  }

  get request() {
    return this._config.request;
  }

  get dataRequest() {
    return this._config.dataRequest;
  }

  get params() {
    return this._config.params;
  }

  /* -------------------- */

  private _createRequests() {
    //
  }
}
