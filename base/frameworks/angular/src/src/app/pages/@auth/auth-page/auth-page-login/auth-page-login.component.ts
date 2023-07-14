import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Form } from 'src/app/utils/form/form';
import { SharedModule } from 'src/app/shared.module';
import { AuthSystemUserHttpService } from 'src/app/services/http/auth-system-user-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FormModule } from 'src/app/utils/form/form.module';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule } from '@abacritt/angularx-social-login';
import { filter, skip } from 'rxjs';
import { authLoginFormMock } from 'src/app/mocks/auth-login-form.mock';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';

@Component({
  selector: 'app-auth-page-login',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    SocialLoginModule,
    RequestComponent,
    GoogleSigninButtonModule,
  ],
  templateUrl: './auth-page-login.component.html',
  styleUrls: ['./auth-page-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageLoginComponent {

  formLogin: Form;
  formLoginGoogle: Form;

  constructor(
    public authS: AuthService,
    private _authSystemUserHttpS: AuthSystemUserHttpService,
    private _socialAuthService: SocialAuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
  ) {

    this.formLogin = new Form(this._fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember_me: [false, [Validators.required]],
    }), {
      mock: authLoginFormMock(),
      request: {
        send: () => this._authSystemUserHttpS.login({ ...this.formLogin.group.value }),
        success: () => {
          this._router.navigateByUrl(this._route.snapshot.queryParamMap.get('redirectTo') || '/', {
            replaceUrl: true,
          });
        },
        reset: true,
      },
    });

    /* -------------------- */

    this.formLoginGoogle = new Form(this._fb.group({
      token: ['', [Validators.required]],
    }), {
      request: {
        send: () => this._authSystemUserHttpS.loginGoogle({ ...this.formLoginGoogle.group.value }),
        success: () => {
          this._router.navigateByUrl(this._route.snapshot.queryParamMap.get('redirectTo') || '/', {
            replaceUrl: true,
          });
        },
        reset: true,
      },
    });

    this._socialAuthService.authState.pipe(
      takeUntilDestroyed(),
      skip(1),
      filter(socialUser => !!socialUser)
    ).subscribe(socialUser => {
      this.formLoginGoogle.group.get('token')?.setValue(socialUser.idToken);
      this.formLoginGoogle.submit();
    });
  }
}
