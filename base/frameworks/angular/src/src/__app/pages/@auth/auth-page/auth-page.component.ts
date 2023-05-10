import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SvgCoffeeBreakLogoComponent } from 'src/app/components/svg/svg.components';
import { SharedModule } from 'src/app/shared.module';
import { AuthPageLoginComponent } from './auth-page-login/auth-page-login.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AuthPageRegisterComponent } from './auth-page-register/auth-page-register.component';
import { AuthPagePasswordResetRequestComponent } from './auth-page-password-reset-request/auth-page-password-reset-request.component';
import { AuthPagePasswordResetUpdateComponent } from './auth-page-password-reset-update/auth-page-password-reset-update.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    SvgCoffeeBreakLogoComponent,
    AuthPageLoginComponent,
    AuthPageRegisterComponent,
    AuthPagePasswordResetRequestComponent,
    AuthPagePasswordResetUpdateComponent,
    NzTabsModule,
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export default class AuthPageComponent {

  passwordResetHash: string;

  constructor(
    private _route: ActivatedRoute,
  ) {

    this.passwordResetHash = this._route.snapshot.queryParamMap.get('passwordResetHash') || '';
  }
}
