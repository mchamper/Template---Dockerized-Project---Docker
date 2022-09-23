import { Request } from "src/app/commons/request";
import { factory } from "./factory";

export class Detail<T> {

  value: T | null = null;
  request: Request = new Request();

  constructor() { }

  /* -------------------- */

  get(): T | null {
    return this.value;
  }

  set(value: T, className?: any): void {
    if (className) {
      value = factory.create<T>(value, className);
    }

    this.value = value;
  }

  has(): boolean {
    return !!this.value;
  }
}
