import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormModule } from '../../core/features/form/form.module';
import { PageTitleComponent } from '../../core/components/layouts/page-title/page-title.component';
import { Form } from '../../core/features/form/form.class';
import { AuthService } from '../../services/auth.service';
import { AuthSystemUserHttpService } from '../../services/http/auth-system-user-http.service';
import { ChAccountVerificationComponent } from './ch-account-verification/ch-account-verification.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzDividerModule,
    NzIconModule,
    PageTitleComponent,
    ChAccountVerificationComponent,
  ],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountPageComponent {

  private _fb = inject(FormBuilder);
  private _authSystemUserHttpS = inject(AuthSystemUserHttpService);
  authS = inject(AuthService);

  form: Form;

  constructor() {
    this.form = new Form(this._fb.group({
      first_name: [this.authS.systemUser().activeSession()?.data?.firstName, [Validators.required]],
      last_name: [this.authS.systemUser().activeSession()?.data?.lastName, [Validators.required]],
      email: [this.authS.systemUser().activeSession()?.data?.email, [Validators.required, Validators.email]],
      picture: [this.authS.systemUser().activeSession()?.data?.model?.data.picture],
      password_current: [''],
      password: [''],
      password_confirmation: [''],
    }), {
      init: (form) => {
        this.authS.systemUser().activeSession()?.hasRole(['Root']) || !this.authS.systemUser().activeSession()?.isVerified()
          ? form.group.disable()
          : form.group.get('email')?.disable();
      },
      request: {
        send: () => this._authSystemUserHttpS.update({ ...this.form.group.value }),
        notify: true,
      }
    });
  }
}
