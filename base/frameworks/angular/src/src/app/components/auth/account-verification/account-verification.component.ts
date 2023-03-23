import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AuthService } from 'src/app/services/auth.service';
import { AuthSystemUserVerificationHttpService } from 'src/app/services/http/auth-system-user-verification-http.service';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';
import { Form } from 'src/app/utils/form/form';
import { FormBuilder } from '@angular/forms';
import { FormModule } from 'src/app/utils/form/components/form.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-verification',
  standalone: true,
  imports: [
    SharedModule,
    NzAlertModule,
    FormModule,
  ],
  templateUrl: './account-verification.component.html',
  styleUrls: ['./account-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountVerificationComponent {

  requestForm: Form;
  verifyForm: Form;

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    public authS: AuthService,
    private _authSystemUserVerificationHttpS: AuthSystemUserVerificationHttpService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
  ) {

    this.requestForm = new Form();
    this.verifyForm = new Form();

    this.verify(this._route.snapshot.queryParamMap.get('verificationHash') || '');
  }

  /* -------------------- */

  request(): void {
    this._sh.add(
      this.requestForm.send(this._authSystemUserVerificationHttpS.request(), {
        prepareOptions: {
          strict: false,
        },
        notify: true,
      })?.subscribe()
    );
  }

  verify(hash: string | null): void {
    if (!hash) return;
    if (this.authS.isVerified()) return;

    this._sh.add(
      this.verifyForm.send(this._authSystemUserVerificationHttpS.verify(hash), {
        prepareOptions: {
          strict: false,
        },
        notify: true,
      })?.subscribe()
    );
  }
}
