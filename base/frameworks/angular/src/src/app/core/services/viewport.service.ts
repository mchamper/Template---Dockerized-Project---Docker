import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, WritableSignal, computed, inject, signal } from "@angular/core";
import { SsrService } from "./ssr.service";
import { fromEvent } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ViewportService {

  private _dom = inject(DOCUMENT);
  private _ssrS = inject(SsrService);

  width = signal(this._ssrS.isBrowser() ? this._dom.defaultView?.innerWidth || 1920 : 1920);

  sizes = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
    xxxl: 1600,
  } as const;

  constructor() {
    // this.width = signal(this._ssrS.isBrowser() ? this._dom.defaultView?.innerWidth || 1920 : 1920);

    // if (this._ssrS.isBrowser()) {
    //   this._dom.defaultView?.addEventListener('resize', () => {
    //     const width = this._dom.defaultView?.innerWidth;

    //     if (width) {
    //       this.width.set(width);
    //     }
    //   });
    // }

    if (this._ssrS.isServer()) return;

    fromEvent(window, 'resize').subscribe(event => {
      const width = this._dom.defaultView?.innerWidth;

        if (width) {
          this.width.set(width);
        }
    });
  }

  /* -------------------- */

  up(size: number | keyof ViewportService['sizes']): boolean {
    return this.width() > this._getSize(size);
  }

  down(size: number | keyof ViewportService['sizes']): boolean {
    return this.width() < this._getSize(size);
  }

  private _getSize(size: number | keyof ViewportService['sizes']): number {
    if (typeof size === 'number') {
      return size;
    }

    return this.sizes[size];
  }
};
