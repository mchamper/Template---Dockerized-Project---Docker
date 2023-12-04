import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthPageLoginComponent } from './auth-page-login/auth-page-login.component';
import { AuthPageRegisterComponent } from './auth-page-register/auth-page-register.component';
import { AuthPagePasswordResetRequestComponent } from './auth-page-password-reset-request/auth-page-password-reset-request.component';
import { AuthPagePasswordResetUpdateComponent } from './auth-page-password-reset-update/auth-page-password-reset-update.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
export class AuthPageComponent {

  private _route = inject(ActivatedRoute);

  authS = inject(AuthService);

  passwordResetHash = this._route.snapshot.queryParamMap.get('passwordResetHash') || undefined;
}
