import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { RouterModule } from '@angular/router';
import { MinWidthComponent } from '../../elementals/min-width/min-width.component';
import { RiveAnimationComponent } from '../../commons/rive-animation/rive-animation.component';

@Component({
  selector: 'app-auth-tpl',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    MinWidthComponent,
    RiveAnimationComponent
  ],
  templateUrl: './auth-tpl.component.html',
  styleUrls: ['./auth-tpl.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthTplComponent {

}
