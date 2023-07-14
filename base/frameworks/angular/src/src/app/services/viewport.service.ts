import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, WritableSignal, signal } from "@angular/core";
import { SsrService } from "./ssr.service";

@Injectable({
  providedIn: 'root'
})
export class ViewportService {

  width: WritableSignal<number>;

  sizes = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
    xxxl: 1600,
  };

  constructor(
    @Inject(DOCUMENT) private _dom: Document,
    private _ssrS: SsrService,
  ) {

    this.width = signal(this._ssrS.isBrowser() ? this._dom.defaultView?.innerWidth || 1920 : 1920);

    if (this._ssrS.isBrowser()) {
      this._dom.defaultView?.addEventListener('resize', () => {
        const width = this._dom.defaultView?.innerWidth;

        if (width) {
          this.width.set(width);
        }
      });
    }
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
    return this.width() > this._getSize(size);
  }

  down(size: number | string): boolean {
    return this.width() < this._getSize(size);
  }
};
