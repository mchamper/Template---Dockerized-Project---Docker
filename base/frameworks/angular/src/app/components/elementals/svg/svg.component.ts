import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SsrService } from 'src/app/services/ssr.service';
import { onViewportIntersection } from 'src/app/helper';

@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})
export class SvgComponent implements OnInit {

  @Input() name!: string;
  @Input() asImage: boolean = false;

  svgContent: any;

  constructor(
    private _elem: ElementRef,
    private _ssrS: SsrService,
    private _httpClient: HttpClient,
    private _sanitizer: DomSanitizer,
  ) { }

  get path(): string {
    return `assets/img/svg/${this.name}.svg`;
  }

  ngOnInit(): void {
    if (this.asImage) return;
    if (this._ssrS.isServer()) return;

    onViewportIntersection(this._elem.nativeElement, () => {
      this._httpClient
        .get(this.path, { responseType: 'text' })
        .subscribe(value => {
          this.svgContent = this._sanitizer.bypassSecurityTrustHtml(value);
        });
    });
  }
}
