import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { HlsDirective } from 'src/app/directives/hls.directive';
import { SsrService } from 'src/app/services/ssr.service';
import { onViewportIntersection } from 'src/app/helper';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    SharedModule,
    HlsDirective,
  ],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoElem') videoElem!: ElementRef<HTMLVideoElement>;

  @Input() type: 'player' | 'background' = 'player';
  @Input() src!: string;
  @Input() width!: string;
  @Input() height!: string;
  @Input() ratio: string = '16x9';

  onViewport: boolean = false;
  cssClass: string = '';

  constructor(
    private _cdr: ChangeDetectorRef,
    private _ssrS: SsrService,
  ) { }

  ngOnInit(): void {
    switch (this.type) {
      case 'player': this.cssClass = `d-block ratio ratio-${this.ratio}`; break;
      case 'background': this.cssClass = `d-inline`; break;
    }
  }

  ngAfterViewInit(): void {
    if (this._ssrS.isServer()) return;

    this.videoElem.nativeElement.playsInline = true;

    onViewportIntersection(this.videoElem.nativeElement, () => {
      this.onViewport = true;
      this._cdr.markForCheck();

      switch (this.type) {
        case 'player': {
          this.videoElem.nativeElement.controls = true;
          break;
        }

        case 'background': {
          this.videoElem.nativeElement.muted = true;
          this.videoElem.nativeElement.loop = true;

          onViewportIntersection(this.videoElem.nativeElement, () => {
            this.videoElem.nativeElement.play();
          }, () => {
            this.videoElem.nativeElement.pause();
          });

          break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    //
  }

}
