import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg-coffee-break-logo',
  standalone: true,
  templateUrl: './coffee-break-logo.svg',
  styleUrls: ['./svg.components.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgCoffeeBreakLogoComponent { }
