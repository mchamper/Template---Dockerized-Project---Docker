import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { Form } from 'src/app/utils/form/form';
import { AuthSystemUserPasswordResetHttpService } from 'src/app/services/http/auth-system-user-password-reset-http.service';
import { FormBuilder, Validators } from '@angular/forms';
import AuthPageComponent from '../auth-page.component';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';

@Component({
  selector: 'app-auth-page-password-reset-update',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestComponent,
    NzAlertModule,
  ],
  templateUrl: './auth-page-password-reset-update.component.html',
  styleUrls: ['./auth-page-password-reset-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPagePasswordResetUpdateComponent {

  form: Form;

  constructor(
    private _parent: AuthPageComponent,
    private _authSystemUserPasswordResetHttpS: AuthSystemUserPasswordResetHttpService,
    private _fb: FormBuilder,
  ) {

    this.form = new Form(this._fb.group({
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    }), {
      request: {
        send: () => this._authSystemUserPasswordResetHttpS.update(this._parent.passwordResetHash, { ...this.form.group.value }),
        reset: true,
      },
    });
  }
}
