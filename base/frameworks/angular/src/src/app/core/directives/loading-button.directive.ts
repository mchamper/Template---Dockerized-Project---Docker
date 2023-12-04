import { Directive, ElementRef, Input, OnChanges, AfterViewInit, inject, SimpleChanges, OnInit } from '@angular/core';
import { SsrService } from '../services/ssr.service';

@Directive({
  selector: 'button[loading]',
  standalone: true
})
export class LoadingButtonDirective implements AfterViewInit, OnChanges {

  private _host = inject(ElementRef);
  private _ssrS = inject(SsrService);

  @Input() loading = false;

  content?: HTMLSpanElement;
  spinner?: HTMLDivElement;

  ngAfterViewInit(): void {
    if (this._ssrS.isServer()) return;

    const content = `
      <span style="display: inherit;">${this._host.nativeElement.innerHTML}</span>
    `;

    const spinner = `
      <div class="spinner-border" role="status" aria-hidden="true" style="
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 1rem;
        height: 1rem;
        border-width: 2px;
      "></div>
    `;

    this._host.nativeElement.innerHTML = content + spinner;
    this._host.nativeElement.style.position = 'relative';

    this.content = this._host.nativeElement.querySelector('button > span');
    this.spinner = this._host.nativeElement.querySelector('button > div');

    this.loading
      ? this.setLoading()
      : this.unsetLoading();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading']) {
      this.loading
        ? this.setLoading()
        : this.unsetLoading();
    }
  }

  /* -------------------- */

  setLoading(): void {
    if (this.content && this.spinner) {
      this.content.style.visibility = 'hidden';
      this.spinner.style.display = 'block';
    }
  }

  unsetLoading(): void {
    if (this.content && this.spinner) {
      this.content.style.visibility = 'visible';
      this.spinner.style.display = 'none';
    }
  }
}
