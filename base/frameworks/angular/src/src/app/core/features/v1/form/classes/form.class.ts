import { AbstractFeature } from "../../../abstract-feature.class";
import { SsrService } from "../../../../services/ssr.service";
import { StorageService } from "../../../../../services/storage.service";
import { CombosHttpService } from "../../../../../services/http/general/combos-http.service";
import { FormGroup } from "@angular/forms";
import { Request } from "../../request/classes/request.class";
import { signal, Signal } from "@angular/core";
import { signalSlice } from "ngxtension/signal-slice";
import { createDefaultRequest } from "../../request/factory";


export class Form<
  GFormGroup extends FormGroup = FormGroup<{}>,
  GRequest extends Request = Request,
  GDataRequest extends Request = Request,
  GParams = { [key: string]: unknown },
> extends AbstractFeature {

  private _ssrS = this._inject(SsrService);
  private _storageS = this._inject(StorageService);
  private _combosHttpS = this._inject(CombosHttpService);

  state: {
    live: Signal<GFormGroup['value']>,
    init: Signal<GFormGroup['value']>,
    current: Signal<GFormGroup['value']>,
  };

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

    /* -------------------- */

    this.state = {
      live: signalSlice({
        initialState: this.group.value,
        sources: [this.group.valueChanges]
      }),
      init: signal(this.group.value),
      current: signal(this.group.value),
    }
  }

  get group() {
    return this._config.group;
  }

  get params() {
    return this._config.params;
  }

  get request() {
    return this._config.request;
  }

  get dataRequest() {
    return this._config.dataRequest;
  }
}
