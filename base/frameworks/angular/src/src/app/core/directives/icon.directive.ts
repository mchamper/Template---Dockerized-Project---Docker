import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';
import { icons } from '../../app.icons';
import { TIconOptions } from '../types/icon.type';

@Directive({
  selector: '[icon]',
  standalone: true,
})
export class IconDirective implements OnInit {

  private _host = inject<ElementRef<HTMLElement>>(ElementRef);

  icon = input.required<string>();
  options = input<TIconOptions>();

  ngOnInit(): void {
    const content = icons.find(icon => icon.type === this.icon())!.content(this.options());
    this._host.nativeElement.innerHTML = content;
  }
}
