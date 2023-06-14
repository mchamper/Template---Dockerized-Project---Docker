import { cloneDeep, upperFirst } from "lodash";
import { BehaviorSubject } from "rxjs";
import { camelize } from "../helper";

export abstract class AbstractModel<T = any> {

  subject$: BehaviorSubject<T>;
  raw: any;

  constructor(data: any, parserMethod?: string) {
    this.raw = cloneDeep(data);
    data = camelize(data);

    if (parserMethod && !data._isParsed) {
      data = (this as any)[`parseFrom${upperFirst(parserMethod)}`](data);
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
}
