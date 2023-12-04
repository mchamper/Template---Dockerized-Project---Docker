import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { Form } from 'src/app/utils/form/form';
import { AuthSystemUserPasswordResetHttpService } from 'src/app/services/http/auth-system-user-password-reset-http.service';
import { FormBuilder, Validators } from '@angular/forms';
import { authPasswordResetRequestFormMock } from 'src/app/mocks/auth-password-reset-request-form.mock';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';

@Component({
  selector: 'app-auth-page-password-reset-request',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestComponent,
    NzAlertModule,
  ],
  templateUrl: './auth-page-password-reset-request.component.html',
  styleUrls: ['./auth-page-password-reset-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPagePasswordResetRequestComponent {

  form: Form;

  constructor(
    private _authSystemUserPasswordResetHttpS: AuthSystemUserPasswordResetHttpService,
    private _fb: FormBuilder,
  ) {

    this.form = new Form(this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    }), {
      mock: authPasswordResetRequestFormMock(),
      request: {
        send: () => this._authSystemUserPasswordResetHttpS.request({ ...this.form.group.value }),
        reset: true,
      },
    });
  }
}
