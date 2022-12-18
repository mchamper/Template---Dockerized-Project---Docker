import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { SsrService } from 'src/app/services/ssr.service';
import { EventType, Rive } from 'rive-js';
import { onViewportIntersection } from 'src/app/helper';

@Component({
  selector: 'app-rive-animation',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './rive-animation.component.html',
  styleUrls: ['./rive-animation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiveAnimationComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  @Input() name: string = '';
  @Input() width: number = 900;
  @Input() height: number = 900;
  @Input() fullWidth: boolean = false;

  rivePlayer!: Rive;

  constructor(
    private _ssrS: SsrService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this._ssrS.isServer()) return;

    onViewportIntersection(this.canvas.nativeElement, () => {
      this.rivePlayer = new Rive({
        src: `assets/animations/rive/${this.name}.riv`,
        canvas: this.canvas.nativeElement,
        autoplay: false,
      });

      this.rivePlayer.on(EventType.Load, () => {
        onViewportIntersection(this.canvas.nativeElement, () => {
          this.rivePlayer.reset();
          this.rivePlayer.play();
        }, () =>  {
          this.rivePlayer.pause();
        });
      });
    });
  }

  ngOnDestroy(): void {
    if (this._ssrS.isServer()) return;

    this.rivePlayer?.unsubscribeAll();
    this.rivePlayer?.stop();
  }
}
