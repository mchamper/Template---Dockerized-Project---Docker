import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormModule } from '../../../../core/features/form/form.module';
import { Form } from '../../../../core/features/form/form.class';
import { AuthSystemUserPasswordResetHttpService } from '../../../../services/http/auth-system-user-password-reset-http.service';
import { AuthPageComponent } from '../auth-page.component';

@Component({
  selector: 'app-auth-page-password-reset-update',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzAlertModule,
  ],
  templateUrl: './auth-page-password-reset-update.component.html',
  styleUrls: ['./auth-page-password-reset-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPagePasswordResetUpdateComponent {

  private _parent = inject(AuthPageComponent);
  private _fb = inject(FormBuilder);

  private _authSystemUserPasswordResetHttpS = inject(AuthSystemUserPasswordResetHttpService);

  form: Form;

  constructor() {
    this.form = new Form(this._fb.group({
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    }), {
      request: {
        send: () => this._authSystemUserPasswordResetHttpS.update(this._parent.passwordResetHash!, { ...this.form.group.value }),
      },
      reset: true,
    });
  }
}
