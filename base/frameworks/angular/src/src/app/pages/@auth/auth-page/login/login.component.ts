import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppModule } from '../../../../app.module';
import { FormBuilder, Validators } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule } from '@abacritt/angularx-social-login';
import { AuthService } from '../../../../services/auth.service';
import { AuthSystemUserHttpService } from '../../../../services/http/auth-system-user-http.service';
import { FormModule } from '../../../../core/features/form/form.module';
import { authLoginFormMock } from '../../../../mocks/auth-login-form.mock';
import { Form } from '../../../../core/features/form/form.class';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, skip } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AppModule,
    FormModule,
    NzDividerModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private _fb = inject(FormBuilder);
  private _socialAuthS = inject(SocialAuthService);
  private _authSystemUserHttpS = inject(AuthSystemUserHttpService);

  authS = inject(AuthService);

  formLogin: Form;
  formLoginGoogle: Form;

  constructor() {
    this.formLogin = new Form(this._fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember_me: [false, [Validators.required]],
    }), {
      request: {
        send: () => this._authSystemUserHttpS.login(this.formLogin.group.value),
      },
      reset: true,
      mock: authLoginFormMock(),
    });

    /* -------------------- */

    this.formLoginGoogle = new Form(this._fb.group({
      token: ['', [Validators.required]],
    }), {
      request: {
        send: () => this._authSystemUserHttpS.loginGoogle(this.formLoginGoogle.group.value),
      },
      reset: true,
    });

    this._socialAuthS.authState.pipe(
      takeUntilDestroyed(),
      filter(i => !!i)
    ).subscribe(socialUser => {
      this.formLoginGoogle.group.get('token')?.setValue(socialUser.idToken);
      this.formLoginGoogle.submit();
    });
  }
}
