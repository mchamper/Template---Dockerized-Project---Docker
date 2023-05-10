import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Form } from 'src/app/utils/form/form';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { RequestHandlerComponent } from 'src/app/utils/handlers/request-handler/components/request-handler/request-handler.component';
import { AuthSystemUserHttpService } from 'src/app/services/http/auth-system-user-http.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { authRegisterFormMock } from 'src/app/mocks/auth-register-form.mock';

@Component({
  selector: 'app-auth-page-register',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestHandlerComponent,
    NzAlertModule,
  ],
  templateUrl: './auth-page-register.component.html',
  styleUrls: ['./auth-page-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageRegisterComponent implements OnInit, OnDestroy {

  form: Form;

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    private _authSystemUserHttpS: AuthSystemUserHttpService,
    private _fb: FormBuilder,
  ) {

    this.form = new Form(this._fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    }), {
      mock: authRegisterFormMock(),
    });
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._sh.clean();
  }

  /* -------------------- */

  register(): void {
    const input = {
      ...this.form.group.value,
    };

    this._sh.add(
      this.form.send(this._authSystemUserHttpS.register(input), {
        reset: true,
      })?.subscribe()
    );
  }
}
