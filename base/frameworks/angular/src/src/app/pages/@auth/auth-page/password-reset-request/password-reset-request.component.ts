import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormBuilder, Validators } from '@angular/forms';
import { FormModule } from '../../../../core/features/form/form.module';
import { Form } from '../../../../core/features/form/form.class';
import { AuthUserPasswordResetHttpService } from '../../../../services/http/auth-user-password-reset-http.service';
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
  private _authUserPasswordResetHttpS = inject(AuthUserPasswordResetHttpService);

  form = new Form(this._fb.group({
    email: this._fb.control('', { validators: [Validators.required, Validators.email] }),
  }), {
    request: {
      send: (): any => this._authUserPasswordResetHttpS.request('systemUser', this.form.group.value),
    },
    reset: true,
    mock: authPasswordResetRequestFormMock(),
  });;

  constructor() {
    //
  }
}
