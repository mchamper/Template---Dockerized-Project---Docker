import { AbstractFeature } from "../../../abstract-feature.class";
import { SsrService } from "../../../../services/ssr.service";
import { StorageService } from "../../../../../services/storage.service";
import { CombosHttpService } from "../../../../../services/http/general/combos-http.service";
import { FormGroup } from "@angular/forms";
import { Request } from "../../request/classes/request.class";
import { effect, signal, Signal } from "@angular/core";
import { signalSlice } from "ngxtension/signal-slice";
import { createDefaultRequest } from "../../request/factory";
import { md5 } from "../../../../utils/helpers/hash.helper";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { distinctUntilDeeplyChanged } from "../../../../rxjs/distincs-until-deeply-changed";


export class Form<
  GFormGroup extends FormGroup = FormGroup<{}>,
  GRequest extends Request = Request,
  GDataRequest extends Request = Request,
  GParams = { [key: string]: unknown },
> extends AbstractFeature<
  {
    request?: GRequest,
    dataRequest?: GDataRequest,
  }
> {

  private _ssrS = this._inject(SsrService);
  private _storageS = this._inject(StorageService);
  private _combosHttpS = this._inject(CombosHttpService);

  state!: {
    status: Signal<GFormGroup['status']>,
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
      save?: boolean;
      reset?: boolean;
      persist?: boolean;
      params?: GParams,
    },
    options?: AbstractFeature['_options'],
  ) {
    super(options);

    this._config = {
      ...this._config,
    };

    /* -------------------- */

    this._createState();
    this._createRequests();
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

  /* -------------------- */

  private async _createState() {
    this.state = {
      status: signalSlice({
        initialState: this.group.status,
        sources: [this.group.statusChanges],
      }),
      live: signalSlice({
        initialState: this.group.value,
        sources: [this.group.valueChanges],
      }),
      init: signal(this.group.value),
      current: signal(this.group.value),
    }

    if (this._config.save) {
      const hash = md5(this.state.init());
      const key = `form.state.${hash}`;

      toObservable(this.state.live, { injector: this._injector })
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          debounceTime(300),
          distinctUntilDeeplyChanged(),
        )
        .subscribe((value) => {
          this._storageS.set(key, value, { base64: true });
        });

      const value = await this._storageS.get(key, { base64: true });

      if (value) {
        this.group.setValue(value);
      }
    }
  }

  private _createRequests() {

  }
}
