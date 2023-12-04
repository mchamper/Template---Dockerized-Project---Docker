import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Form } from 'src/app/utils/form/form';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { AuthSystemUserHttpService } from 'src/app/services/http/auth-system-user-http.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { authRegisterFormMock } from 'src/app/mocks/auth-register-form.mock';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';

@Component({
  selector: 'app-auth-page-register',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestComponent,
    NzAlertModule,
  ],
  templateUrl: './auth-page-register.component.html',
  styleUrls: ['./auth-page-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageRegisterComponent {

  form: Form;

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
      request: {
        send: () => this._authSystemUserHttpS.register({ ...this.form.group.value }),
        reset: true,
      },
    });
  }
}
