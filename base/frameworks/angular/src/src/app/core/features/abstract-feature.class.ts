import { DestroyRef, inject, Injector, ProviderToken } from "@angular/core";

export abstract class AbstractFeature {

  protected abstract _config: unknown;

  constructor(
    protected _options?: {
      injector?: Injector,
    }
  ) { }

  get destroyRef() {
    return this._inject(DestroyRef);
  }

  /* -------------------- */

  protected _inject<T = any>(token: ProviderToken<T>) {
    return this._options?.injector?.get(token) || inject(token);
  }
}
