import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AccountVerificationComponent } from 'src/app/components/auth/account-verification/account-verification.component';
import { AuthService } from 'src/app/services/auth.service';
import { AuthSystemUserHttpService } from 'src/app/services/http/auth-system-user-http.service';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { Form } from 'src/app/utils/form/form';
import { RequestHandlerComponent } from 'src/app/utils/handlers/request-handler/components/request-handler/request-handler.component';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';
import { SectionTitleComponent } from 'src/app/components/layouts/section-title/section-title.component';
import { FormSectionTitleComponent } from 'src/app/components/layouts/form-section-title/form-section-title.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    SharedModule,
    AccountVerificationComponent,
    FormModule,
    NzDividerModule,
    RequestHandlerComponent,
    SectionTitleComponent,
    FormSectionTitleComponent,
  ],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AccountPageComponent implements OnInit, OnDestroy {

  form: Form;

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    public authS: AuthService,
    private _authSystemUserHttpS: AuthSystemUserHttpService,
    private _fb: FormBuilder
  ) {

    this.form = new Form(this._fb.group({
      first_name: [this.authS.data()?.firstName, [Validators.required]],
      last_name: [this.authS.data()?.lastName, [Validators.required]],
      email: [this.authS.data()?.email, [Validators.required, Validators.email]],
      password_current: [''],
      password: [''],
      password_confirmation: [''],
    }), {
      onInit: (form) => {
        if (this.authS.hasRole('Root')) {
          form.group.disable();
        } else {
          form.group.get('email')?.disable();
        }
      }
    });
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._sh.clean();
  }

  /* -------------------- */

  update(): void {
    const input = {
      ...this.form.group.value,
    };

    this._sh.add(
      this.form.send(this._authSystemUserHttpS.update(input), {
        success: () => {
          this.form.getControl('password_current')?.setValue('');
          this.form.getControl('password')?.setValue('');
          this.form.getControl('password_confirmation')?.setValue('');

          this.form.state.persist();
        },
        notify: true,
      })?.subscribe()
    );
  }
}
