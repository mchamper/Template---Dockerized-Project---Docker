import { BehaviorSubject } from "rxjs";

export abstract class AbstractModel<T = any> {

  subject$: BehaviorSubject<T>;

  constructor(data: T) {
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
