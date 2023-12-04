import { DestroyRef, Injector, Signal, WritableSignal, computed, signal } from "@angular/core";
import { TAuthGuardRawSession } from "../services/abstract-auth.service";
import { camelizeParser } from "../utils/parsers/camelize.parser";
import { Subscription } from "rxjs";
import { isArray, mapValues, merge, omit } from "lodash";
import { isMoment } from "moment";
// import Echo, { Channel as SocketChanel } from "laravel-echo";

export type TAuthModelData = TAuthGuardRawSession['data'];

export type TAuthModel = {
  getAuthData(): TAuthModelData;
}

type InitData<Data> = Partial<Data> & { _isParsed?: boolean };

export abstract class AbstractModel<Data = any, Parser = undefined> {

  /**
   * Parsers to parse the raw data.
   */
  protected abstract _parsers(): { [key: string]: (data: any) => Partial<Data> };

  protected _subscriptions: Subscription[] = [];
  // protected _sockets: { name: string, channel: SocketChanel }[] = [];
  protected _injector?: Injector;

  /**
   * Signal data from the instance.
   */
  readonly d: WritableSignal<Data>;

  /**
   * Raw data from the instance.
   */
  readonly r: Signal<InitData<Data>> = computed(() => {
    const map = (data: any): any => {
      data = omit(data, '_isParsed');

      return mapValues(data, (value) => {
        if (value instanceof AbstractModel) {
          return map(value.data);
        }

        if (isMoment(value)) {
          return value.toISOString();
        }

        if (isArray(value)) {
          return value.map((arrayValue) => {
            if (arrayValue instanceof AbstractModel) {
              return map(arrayValue.data);
            }

            return arrayValue;
          });
        }

        return value;
      });
    };

    return map(this.d());
  });

  /* -------------------- */

  constructor(data: InitData<Data> | InitData<Data>[], options?: { parser?: Parser, injector?: Injector }) {
    this._injector = options?.injector;

    if (isArray(data)) {
      data = merge(data[0], data[1]);
    }

    if (options?.parser && !data._isParsed) {
      data = camelizeParser(data);
      data = (this as any)._parsers()[options?.parser as string](data);
      (data as InitData<Data>)._isParsed = true;
    }

    this.d = signal(data as Data);

    if (this._injector) {
      this._injector.get(DestroyRef).onDestroy(() => this.clean());
    }

    this._onInit();
  }

  get data() {
    return this.d();
  }

  get raw() {
    return this.r();
  }

  /* -------------------- */

  protected _onInit() {
    //
  }

  /* -------------------- */

  clean() {
    this.cleanSubscriptions();
    this.cleanSockets();
  }

  cleanSubscriptions() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
    this._subscriptions = [];
  }

  cleanSockets() {
    // this._sockets.forEach(socket => {
    //   ((window as any).AppClientEcho as Echo)?.leave(socket.name);
    //   ((window as any).UserEcho as Echo)?.leave(socket.name);
    // });

    // this._sockets = [];
  }

  /* -------------------- */

  update(data: Partial<Data>, parser?: Parser) {
    let currentData = parser ? this.r() : this.d();

    if (parser) {
      merge(currentData, camelizeParser(data));
      currentData = this._parsers()[parser as string](currentData);
      currentData._isParsed = true;
    } else {
      merge(currentData, data);
    }

    this.d.update(() => {
      return currentData as Data;
    });
  }

  cleanAndUpdate(data: Partial<Data>, parser?: Parser) {
    this.clean();
    this.update(data, parser);
  }

  cleanSubscriptionsAndUpdate(data: Partial<Data>, parser?: Parser) {
    this.cleanSubscriptions();
    this.update(data, parser);
  }

  cleanSocketsAndUpdate(data: Partial<Data>, parser?: Parser) {
    this.cleanSockets();
    this.update(data, parser);
  }

  /* -------------------- */

  // getSocket(name: string)  {
  //   return this._sockets.find(socket => socket.name === name);
  // }

  // hasSocket(name: string): boolean {
  //   return this._sockets.some(socket => socket.name === name);
  // }
}
