import { createDefaultRequest } from "../../request/classes/factory";
import { _Form } from "./form.class";

export function FormRequest<TBase extends new (...args: any[]) => _Form>(Base: TBase) {
  return class FormRequest extends Base {

    combosRequest = createDefaultRequest();
    actionRequest = createDefaultRequest();

    constructor(...args: any[]) {
      super();
    }

    get request() {
      return this._config.request;
    }

    get dataRequest() {
      return this._config.dataRequest;
    }
  };
}
