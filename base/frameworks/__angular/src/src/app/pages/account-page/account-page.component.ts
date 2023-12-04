import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AccountVerificationComponent } from 'src/app/components/auth/account-verification/account-verification.component';
import { AuthService } from 'src/app/services/auth.service';
import { AuthSystemUserHttpService } from 'src/app/services/http/auth-system-user-http.service';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { Form } from 'src/app/utils/form/form';
import { SectionTitleComponent } from 'src/app/components/layouts/section-title/section-title/section-title.component';
import { FormSectionTitleComponent } from 'src/app/components/layouts/form-section-title/form-section-title.component';
import { MissingChannelWarningComponent } from 'src/app/components/auth/missing-channel-warning/missing-channel-warning.component';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormFooterComponent } from 'src/app/components/layouts/form-footer/form-footer.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    SharedModule,
    AccountVerificationComponent,
    FormModule,
    NzDividerModule,
    RequestComponent,
    SectionTitleComponent,
    FormSectionTitleComponent,
    FormFooterComponent,
    MissingChannelWarningComponent,
    NzIconModule,
  ],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AccountPageComponent {

  form: Form;

  constructor(
    public authS: AuthService,
    private _authSystemUserHttpS: AuthSystemUserHttpService,
    private _fb: FormBuilder
  ) {

    this.form = new Form(this._fb.group({
      first_name: [this.authS.systemUser().data()?.firstName, [Validators.required]],
      last_name: [this.authS.systemUser().data()?.lastName, [Validators.required]],
      email: [this.authS.systemUser().data()?.email, [Validators.required, Validators.email]],
      password_current: [''],
      password: [''],
      password_confirmation: [''],
    }), {
      onInit: (form) => {
        this.authS.systemUser().hasRole('Root')
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
