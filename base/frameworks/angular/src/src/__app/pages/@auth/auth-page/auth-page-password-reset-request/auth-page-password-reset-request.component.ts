import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/components/form.module';
import { RequestHandlerComponent } from 'src/app/utils/handlers/request-handler/components/request-handler/request-handler.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { Form } from 'src/app/utils/form/form';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';
import { AuthSystemUserPasswordResetHttpService } from 'src/app/services/http/auth-system-user-password-reset-http.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-page-password-reset-request',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestHandlerComponent,
    NzAlertModule,
  ],
  templateUrl: './auth-page-password-reset-request.component.html',
  styleUrls: ['./auth-page-password-reset-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPagePasswordResetRequestComponent implements OnInit, OnDestroy {

  form: Form;

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    private _authSystemUserPasswordResetHttpS: AuthSystemUserPasswordResetHttpService,
    private _fb: FormBuilder,
  ) {

    this.form = new Form(this._fb.group({
      email: ['marcelo@trescientosuno.com.ar', [Validators.required, Validators.email]],
    }));
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._sh.clean();
  }

  /* -------------------- */

  request(): void {
    const input = {
      ...this.form.group.value,
    };

    this._sh.add(
      this.form.send(this._authSystemUserPasswordResetHttpS.request(input), {
        reset: true,
      })?.subscribe()
    );
  }
}
