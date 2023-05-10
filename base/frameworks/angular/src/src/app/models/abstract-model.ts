import { camelCase, isArray, isObject, transform, upperFirst } from "lodash";
import { BehaviorSubject } from "rxjs";

export abstract class AbstractModel<T = any> {

  subject$: BehaviorSubject<T>;

  constructor(data: any, parserMethod?: string) {
    data = this._camelize(data);

    if (parserMethod && !data._isParsed) {
      data = (this as any)[`getParsedFrom${upperFirst(parserMethod)}`](data);
      data._isParsed = true;
    }

    this.subject$ = new BehaviorSubject(data);
  }

  get data(): T {
    return this.subject$.value;
  }
  get data$(): BehaviorSubject<T> {
    return this.subject$;
  }

  set data(data: Partial<T>) {
    this.subject$.next({
      ...this.data,
      data,
    });
  }

  /* -------------------- */

  protected _camelize(obj: any) {
    return transform(obj, (acc: any, value: any, key: string, target) => {
      const camelKey = isArray(target) ? key : camelCase(key);
      acc[camelKey] = isObject(value) ? this._camelize(value) : value;
    });
  };
}
