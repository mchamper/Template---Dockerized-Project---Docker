import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { SsrService } from '../services/ssr.service';
import Hls from 'hls.js';

@Directive({
  selector: '[appHls]',
  standalone: true
})
export class HlsDirective implements OnInit, OnChanges, OnDestroy {

  @Input('appHls') source!: string;

  hls?: Hls;

  constructor(
    private _elem: ElementRef<HTMLVideoElement>,
    private _ssrS: SsrService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any): void {
    if (changes.source) {
      this.init();
    }
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
  }

  /* -------------------- */

  init(): void {
    if (this._ssrS.isServer()) return;

    if (!this.source) {
      if (this.hls) {
        this.hls.destroy();
        this.hls = undefined;
      }

      return;
    }

    const source = this.source.split('?')[0];

    if (!source.endsWith('m3u8')) {
      this._elem.nativeElement.src = this.source;
    }
    else if (Hls.isSupported()) {
      if (this.hls) {
        this.hls.destroy();
      }

      this.hls = new Hls();
      this.hls.loadSource(this.source);
      this.hls.attachMedia(this._elem.nativeElement);
    }
    else if (this._elem.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
      this._elem.nativeElement.src = this.source;
    }
  }
}
