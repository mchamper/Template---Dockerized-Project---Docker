import { AfterViewInit, Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { onViewportIntersection } from '../helper';
import { SsrService } from '../services/ssr.service';

@Directive({
  selector: 'img',
  standalone: true
})
export class LazyImageDirective implements AfterViewInit {

  @HostBinding('attr.src') srcAttr: string = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  @Input() src!: string;

  constructor(
    private _elem: ElementRef<HTMLImageElement>,
    private _ssrS: SsrService,
  ) { }

  ngAfterViewInit(): void {
    if (this._ssrS.isServer()) return;

    if ('loading' in HTMLImageElement.prototype) {
      this._elem.nativeElement.setAttribute('loading', 'lazy');
      this._load();
    } else {
      this._lazyLoad();
    }
  }

  /* -------------------- */

  private _lazyLoad(): void {
    onViewportIntersection(this._elem.nativeElement, () => {
      this._load();
    });
  }

  private _load(): void {
    setTimeout(() => this.srcAttr = this.src);
  }
}
