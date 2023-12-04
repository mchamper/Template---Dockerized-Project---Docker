import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormModule } from '../../../../core/features/form/form.module';
import { Form } from '../../../../core/features/form/form.class';
import { AuthSystemUserHttpService } from '../../../../services/http/auth-system-user-http.service';
import { authRegisterFormMock } from '../../../../mocks/auth-register-form.mock';

@Component({
  selector: 'app-auth-page-register',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzAlertModule,
  ],
  templateUrl: './auth-page-register.component.html',
  styleUrls: ['./auth-page-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageRegisterComponent {

  private _fb = inject(FormBuilder);

  private _authSystemUserHttpS = inject(AuthSystemUserHttpService);

  form: Form;

  constructor() {
    this.form = new Form(this._fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    }), {
      request: {
        send: () => this._authSystemUserHttpS.register({ ...this.form.group.value }),
      },
      reset: true,
      mock: authRegisterFormMock(),
    });
  }
}
