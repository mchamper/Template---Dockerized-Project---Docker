import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormModule } from '../../../../core/features/form/form.module';
import { Form } from '../../../../core/features/form/form.class';
import { AuthUserPasswordResetHttpService } from '../../../../services/http/auth-user-password-reset-http.service';
import { AuthPageComponent } from '../auth-page.component';

@Component({
  selector: 'app-password-reset-update',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzAlertModule,
  ],
  templateUrl: './password-reset-update.component.html',
  styleUrls: ['./password-reset-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordResetUpdateComponent {

  private _fb = inject(FormBuilder);
  private _authUserPasswordResetHttpS = inject(AuthUserPasswordResetHttpService);
  parent = inject(AuthPageComponent);

  form = new Form(this._fb.group({
    password: this._fb.control('', { validators: [Validators.required] }),
    password_confirmation: this._fb.control('', { validators: [Validators.required] }),
  }), {
    request: {
      send: (): any => this._authUserPasswordResetHttpS.update('systemUser', this.parent.passwordResetHash()!, this.form.group.value),
    },
    reset: true,
  });

  constructor() {
    //
  }
}
