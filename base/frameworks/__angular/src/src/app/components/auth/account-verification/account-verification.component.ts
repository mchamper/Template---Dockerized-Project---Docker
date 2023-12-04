import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AuthService } from 'src/app/services/auth.service';
import { AuthSystemUserVerificationHttpService } from 'src/app/services/http/auth-system-user-verification-http.service';
import { FormModule } from 'src/app/utils/form/form.module';
import { ActivatedRoute } from '@angular/router';
import { Request } from 'src/app/utils/request/request';

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

  @Input() isVerified?: boolean;

  hash = this._route.snapshot.queryParamMap.get('verificationHash') || '';

  requestRequest = new Request({
    send: () => this._authSystemUserVerificationHttpS.request(),
    notify: true,
  });

  verifyRequest = new Request({
    send: () => this._authSystemUserVerificationHttpS.verify(this.hash),
    notify: true,
  });

  constructor(
    public authS: AuthService,
    private _authSystemUserVerificationHttpS: AuthSystemUserVerificationHttpService,
    private _route: ActivatedRoute,
  ) {

    if (this.hash) {
      this.verifyRequest.run();
    }
  }
}
