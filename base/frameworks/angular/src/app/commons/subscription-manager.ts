import { Subscription } from 'rxjs';

export class SubscriptionManager {

  private _sa: Subscription[] = [];
  private _so: any = {};

  constructor() { }

  /* -------------------- */

  add(s: Subscription | Subscription[] | undefined, name?: string | number) {
    if (Array.isArray(s)) {
      s.forEach(item => this.add(item));
    } else {
      if (name) {
        this.clean(name);
        this._so[name] = s;
      } else if (s) {
        this._sa.push(s);
      }
    }
  }

  get(name: string | number) {
    if (typeof name === 'string') {
      return this._so[name];
    }

    return this._sa[name];
  }

  clean(name?: string | number) {
    if (name) {
      if (this._so[name] instanceof Subscription) {
        this._so[name].unsubscribe();
      }
    } else {
      this._sa.forEach(value => value.unsubscribe());

      for (const key of Object.keys(this._so)) {
        this._so[key].unsubscribe();
      }
    }
  }
}
