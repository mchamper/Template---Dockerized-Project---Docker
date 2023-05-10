import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { RouterModule } from '@angular/router';
import { SvgCoffeeBreakLogoComponent } from '../../svg/svg.components';

@Component({
  selector: 'app-auth-tpl',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    SvgCoffeeBreakLogoComponent,
  ],
  templateUrl: './auth-tpl.component.html',
  styleUrls: ['./auth-tpl.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthTplComponent {

}
