import { Directive, ElementRef, Input, OnChanges, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appLoadingBtn]',
  standalone: true
})
export class LoadingBtnDirective implements AfterViewInit, OnChanges {

  @Input('appLoadingBtn') loading: boolean | null = false;
  @Input() selector: string = 'button';

  content!: HTMLSpanElement | null;
  spinner!: HTMLDivElement | null;

  constructor(
    private _host: ElementRef,
  ) { }

  ngAfterViewInit(): void {
    const content: string = `<span style="display: inherit;">${this._host.nativeElement.innerHTML}</span>`;
    const spinner: string = `<div class="spinner-border" role="status" aria-hidden="true" style="
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 1rem;
      height: 1rem;
      border-width: 2px;
    "></div>`;

    this._host.nativeElement.innerHTML = content + spinner;
    this._host.nativeElement.style.position = 'relative';

    this.content = this._host.nativeElement.querySelector(this.selector + ' > span');
    this.spinner = this._host.nativeElement.querySelector(this.selector + ' > div');

    this.loading
      ? this.setLoading()
      : this.unsetLoading();
  }

  ngOnChanges(changes: any): void {
    if (changes.loading) {
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
