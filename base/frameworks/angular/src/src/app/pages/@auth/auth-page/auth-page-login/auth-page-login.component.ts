import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Form } from 'src/app/utils/form/form';
import { SharedModule } from 'src/app/shared.module';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';
import { AuthSystemUserHttpService } from 'src/app/services/http/auth-system-user-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FormModule } from 'src/app/utils/form/components/form.module';
import { RequestHandlerComponent } from 'src/app/utils/handlers/request-handler/components/request-handler/request-handler.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-page-login',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestHandlerComponent
  ],
  templateUrl: './auth-page-login.component.html',
  styleUrls: ['./auth-page-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageLoginComponent implements OnInit, OnDestroy {

  form: Form;

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    public authS: AuthService,
    private _authSystemUserHttpS: AuthSystemUserHttpService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
  ) {

    this.form = new Form(this._fb.group({
      email: ['marcelo@trescientosuno.com.ar', [Validators.required]],
      password: ['123123', [Validators.required]],
      remember_me: [true, [Validators.required]],
    }));
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._sh.clean();
  }

  /* -------------------- */

  login(): void {
    const input = {
      ...this.form.group.value,
    };

    this._sh.add(
      this.form.send(this._authSystemUserHttpS.login(input), {
        success: (res) => {
          this._router.navigateByUrl(this._route.snapshot.queryParamMap.get('redirectTo') || '/', {
            replaceUrl: true,
          });
        },
        reset: true,
      })?.subscribe()
    );
  }
}
