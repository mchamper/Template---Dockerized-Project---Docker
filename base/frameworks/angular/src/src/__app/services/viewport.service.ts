import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { SsrService } from "./ssr.service";

@Injectable({
  providedIn: 'root'
})
export class ViewportService {

  width$: BehaviorSubject<number>;

  sizes = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  };

  constructor(
    @Inject(DOCUMENT) private _dom: Document,
    private _ssrS: SsrService,
  ) {

    this.width$ = new BehaviorSubject(this._ssrS.isBrowser() ? this._dom.defaultView?.innerWidth || 1920 : 1920);

    if (this._ssrS.isBrowser()) {
      this._dom.defaultView?.addEventListener('resize', () => {
        const width = this._dom.defaultView?.innerWidth;

        if (width) {
          this.width$.next(width);
        }
      });
    }
  }

  get width() {
    return this.width$.value;
  }

  /* -------------------- */

  private _getSize(size: number | string): number {
    if (typeof size === 'number') {
      return size;
    }

    return (this.sizes as any)[size];
  }

  /* -------------------- */

  up(size: number | string): boolean {
    return this.width > this._getSize(size);
  }
  up$(size: number | string): Observable<boolean> {
    return this.width$.pipe(map(() => this.up(size)));
  }

  down(size: number | string): boolean {
    return this.width < this._getSize(size);
  }
  down$(size: number | string): Observable<boolean> {
    return this.width$.pipe(map(() => this.down(size)));
  }
};
