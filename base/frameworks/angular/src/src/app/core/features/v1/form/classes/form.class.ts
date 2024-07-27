import { Injector } from "@angular/core";
import { AbstractFeature } from "../../../abstract-feature.class";
import { SsrService } from "../../../../services/ssr.service";
import { StorageService } from "../../../../../services/storage.service";
import { CombosHttpService } from "../../../../../services/http/general/combos-http.service";

export class Form extends AbstractFeature {

  private _ssrS = this._inject(SsrService);
  private _storageS = this._inject(StorageService);
  private _combosHttpS = this._inject(CombosHttpService);

  constructor(
    private _config: {
      //
    },
    options?: AbstractFeature['_options'],
  ) {
    super(options);

    this._config = {
      ...this._config,
    };
  }

  /* -------------------- */
}
