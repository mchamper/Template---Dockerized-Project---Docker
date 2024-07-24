import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormBuilder, Validators } from '@angular/forms';
import { FormModule } from '../../../../core/features/form/form.module';
import { Form } from '../../../../core/features/form/form.class';
import { AuthSystemUserPasswordResetHttpService } from '../../../../services/http/auth-system-user-password-reset-http.service';
import { authPasswordResetRequestFormMock } from '../../../../mocks/auth-password-reset-request-form.mock';

@Component({
  selector: 'app-password-reset-request',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzAlertModule,
  ],
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordResetRequestComponent {

  private _fb = inject(FormBuilder);
  private _authSystemUserPasswordResetHttpS = inject(AuthSystemUserPasswordResetHttpService);

  form: Form;

  constructor() {
    this.form = new Form(this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    }), {
      request: {
        send: () => this._authSystemUserPasswordResetHttpS.request({ ...this.form.group.value }),
      },
      reset: true,
      mock: authPasswordResetRequestFormMock(),
    });
  }
}
