import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormModule } from '../../../../core/features/form/form.module';
import { Form } from '../../../../core/features/form/form.class';
import { AuthUserHttpService } from '../../../../services/http/auth-user-http.service';
import { authRegisterFormMock } from '../../../../mocks/auth-register-form.mock';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzAlertModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

  private _fb = inject(FormBuilder);
  private _authUserHttpS = inject(AuthUserHttpService);

  form = new Form(this._fb.group({
    first_name: this._fb.control('', { validators: [Validators.required] }),
    last_name: this._fb.control('', { validators: [Validators.required] }),
    email: this._fb.control('', { validators: [Validators.required, Validators.email] }),
    password: this._fb.control('', { validators: [Validators.required] }),
    password_confirmation: this._fb.control('', { validators: [Validators.required] }),
  }), {
    request: {
      send: (): any => this._authUserHttpS.register('systemUser', this.form.group.value),
    },
    reset: true,
    mock: authRegisterFormMock(),
  });;

  constructor() {
    //
  }
}
