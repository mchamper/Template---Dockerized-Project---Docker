import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormModule } from '../../core/features/form/form.module';
import { PageTitleComponent } from '../../components/layouts/page-title/page-title.component';
import { Form } from '../../core/features/form/form.class';
import { AuthService } from '../../services/auth.service';
import { AuthUserHttpService } from '../../services/http/auth-user-http.service';
import { VerificationComponent } from './verification/verification.component';
import { BoxSectionTitleComponent } from '../../components/layouts/box-section-title/box-section-title.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzDividerModule,
    NzIconModule,
    PageTitleComponent,
    BoxSectionTitleComponent,
    VerificationComponent,
  ],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountPageComponent {

  private _fb = inject(FormBuilder);
  private _authUserHttpS = inject(AuthUserHttpService);
  authS = inject(AuthService);

  form = new Form(this._fb.group({
    first_name: this._fb.control(this.authS.systemUser().activeSession()?.data?.firstName, {validators: [Validators.required] }),
    last_name: this._fb.control(this.authS.systemUser().activeSession()?.data?.lastName, {validators: [Validators.required] }),
    email: this._fb.control(this.authS.systemUser().activeSession()?.data?.email, {validators: [Validators.required, Validators.email] }),
    picture: this._fb.control(this.authS.systemUser().activeSession()?.data?.model?.data.picture),
    password_current: this._fb.control(''),
    password: this._fb.control(''),
    password_confirmation: this._fb.control(''),
  }), {
    request: {
      send: (): any => this._authUserHttpS.update('systemUser', this.form.group.value),
      success: (res) => this.form.persist({ ...res.body.data, password_current: null, password: null, password_confirmation: null }),
      notify: true,
    }
  });;

  constructor() {
    effect(() => {
      if (this.authS.systemUser().activeSession()?.hasRole(['Root']) || !this.authS.systemUser().activeSession()?.isVerified()) {
        this.form.group.disable();
      } else {
        this.form.group.enable();
        this.form.getControl('email').disable();
      }
    }, { allowSignalWrites: true });
  }
}
