import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { fixElem } from '../../../utils/helpers/dom.helper';
import { FixedDirective } from '../../../directives/fixed.directive';

@Component({
  selector: 'app-fixed',
  standalone: true,
  imports: [CommonModule, FixedDirective],
  templateUrl: './fixed.component.html',
  styleUrl: './fixed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FixedComponent implements OnInit {

  private _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _dom = inject(DOCUMENT);

  @Input() height: number | 'auto' = 'auto';

  ngOnInit(): void {
    fixElem(this._dom, this._host.nativeElement.querySelector('.fixed-container > *')!, this.height);
  }
}
