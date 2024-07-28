import { AbstractFeature } from "../../../abstract-feature.class";
import { SsrService } from "../../../../services/ssr.service";
import { StorageService } from "../../../../../services/storage.service";
import { CombosHttpService } from "../../../../../services/http/general/combos-http.service";
import { FormGroup } from "@angular/forms";
import { createDefaultRequest } from "../../request/classes/factory";
import { Request } from "../../request/classes/request.class";

export class Form<
  GFormGroup = FormGroup,
  GRequest = Request,
  GDataRequest = Request,
  GParams = { [key: string]: unknown },
> extends AbstractFeature {

  private _ssrS = this._inject(SsrService);
  private _storageS = this._inject(StorageService);
  private _combosHttpS = this._inject(CombosHttpService);

  combosRequest = createDefaultRequest();
  actionRequest = createDefaultRequest();

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
