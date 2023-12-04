import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { SvgCoffeeBreakLogoComponent } from '../../svg/svg.components';

@Component({
  selector: 'app-offcanvas',
  standalone: true,
  imports: [
    SharedModule,
    SvgCoffeeBreakLogoComponent,
  ],
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffcanvasComponent {

  @Input() name: string = '';
  @Input() position: 'start' | 'end' | 'top' | 'bottom' = 'start';
  @Input() bodyClass!: string;
}
