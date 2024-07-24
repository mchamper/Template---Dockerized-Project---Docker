import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppModule } from '../../../../app.module';
import { FormBuilder, Validators } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AuthService } from '../../../../services/auth.service';
import { AuthUserHttpService } from '../../../../services/http/auth-user-http.service';
import { FormModule } from '../../../../core/features/form/form.module';
import { authLoginFormMock } from '../../../../mocks/auth-login-form.mock';
import { Form } from '../../../../core/features/form/form.class';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AppModule,
    FormModule,
    NzDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private _fb = inject(FormBuilder);
  private _authUserHttpS = inject(AuthUserHttpService);
  authS = inject(AuthService);

  form = new Form(this._fb.group({
    email: this._fb.control('', { validators: [Validators.required] }),
    password: this._fb.control('', { validators: [Validators.required] }),
    remember_me: this._fb.control(false, { validators: [Validators.required] }),
  }), {
    request: {
      send: (): any => this._authUserHttpS.login('systemUser', this.form.group.value),
    },
    reset: true,
    mock: authLoginFormMock(),
  });

  constructor() {
    //
  }
}
