import { Directive, ElementRef, Input, OnInit, booleanAttribute, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fixElem } from '../utils/helpers/dom.helper';

@Directive({
  selector: '[fixed]',
  standalone: true,
})
export class FixedDirective implements OnInit {

  private _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _dom = inject(DOCUMENT);

  @Input() height: number | 'auto' = 'auto';
  @Input({ transform: booleanAttribute }) onBottom = false;

  ngOnInit(): void {
    fixElem(this._dom, this._host.nativeElement, this.height, this.onBottom);
  }
}
