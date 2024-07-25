import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordResetRequestComponent } from './password-reset-request/password-reset-request.component';
import { PasswordResetUpdateComponent } from './password-reset-update/password-reset-update.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzListModule } from 'ng-zorro-antd/list';
import { AuthService } from '../../../services/auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Request } from '../../../core/features/request/request.class';
import { AuthUserHttpService } from '../../../services/http/auth-user-http.service';
import { RequestComponent } from '../../../core/features/request/components/request/request.component';
import { Form } from '../../../core/features/form/form.class';
import { FormBuilder, Validators } from '@angular/forms';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule } from '@abacritt/angularx-social-login';
import { coreConfig } from '../../../configs/core.config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginComponent,
    RegisterComponent,
    PasswordResetRequestComponent,
    PasswordResetUpdateComponent,
    RequestComponent,
    NzTabsModule,
    NzListModule,
    NzAvatarModule,
    NzDividerModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    NzIconModule,
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AuthPageComponent {

  coreConfig = coreConfig;

  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _authUserHttpS = inject(AuthUserHttpService);
  private _socialAuthS = inject(SocialAuthService);
  authS = inject(AuthService);

  passwordResetHash = injectQueryParams('passwordResetHash');
  redirectTo = injectQueryParams('redirectTo');

  addAnotherAccount = signal(false);

  formLoginWithGoogle = new Form(this._fb.group({
    token: this._fb.control('', { validators: [Validators.required] }),
  }), {
    request: {
      send: (): any => this._authUserHttpS.loginWithGoogle('systemUser', this.formLoginWithGoogle.group.value),
      success: () => this.addAnotherAccount.set(false),
    },
    reset: true,
  });

  sessionRefreshRequest = new Request({
    send: () => this._authUserHttpS.me('systemUser'),
  });

  constructor() {
    this._socialAuthS.authState.pipe(
      takeUntilDestroyed(),
      filter(i => !!i)
    ).subscribe(socialUser => {
      this.formLoginWithGoogle.group.controls.token.setValue(socialUser.idToken);
      this.formLoginWithGoogle.submit();
    });
  }

  /* -------------------- */

  selectSession(index: number) {
    this.authS.systemUser().selectSession(index, false);
    this.sessionRefreshRequest.run();
  }

  enter() {
    this._router.navigateByUrl(this.redirectTo() || '/');
  }
}
