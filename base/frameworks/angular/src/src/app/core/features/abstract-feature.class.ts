import { DestroyRef, inject, Injector, ProviderToken } from "@angular/core";

export abstract class AbstractFeature<
  GUpdatableConfig = any,
> {

  protected abstract _config: any;

  constructor(
    protected _options?: {
      injector?: Injector,
    }
  ) { }

  protected get _injector() {
    return this._options?.injector || this._inject(Injector);
  }

  protected get _destroyRef() {
    return this._inject(DestroyRef);
  }

  /* -------------------- */

  protected _inject<T = any>(token: ProviderToken<T>) {
    return this._options?.injector?.get(token) || inject(token);
  }

  updateConfig(config: GUpdatableConfig) {
    this._config = {
      ...this._config,
      ...config,
    }
  }
}
