import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormModule } from '../../../core/features/form/form.module';
import { Request } from '../../../core/features/request/request.class';
import { AuthSystemUserVerificationHttpService } from '../../../services/http/auth-system-user-verification-http.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'ch-account-verification',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzAlertModule,
  ],
  templateUrl: './ch-account-verification.component.html',
  styleUrls: ['./ch-account-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChAccountVerificationComponent {

  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _authSystemUserVerificationHttpS = inject(AuthSystemUserVerificationHttpService);
  authS = inject(AuthService);

  hash = this._route.snapshot.queryParamMap.get('verificationHash') || '';
  requestRequest: Request;
  verifyRequest: Request;

  constructor() {
    this.requestRequest = new Request({
      send: () => this._authSystemUserVerificationHttpS.request(),
      notify: true,
    });

    this.verifyRequest = new Request({
      send: () => this._authSystemUserVerificationHttpS.verify(this.hash),
      success: () => this.clearHashFromUrl(),
      notify: true,
    });

    if (this.hash && !this.authS.systemUser().activeSession()?.isVerified()) {
      this.verifyRequest.run();
    } else {
      this.clearHashFromUrl();
    }
  }

  /* -------------------- */

  clearHashFromUrl() {
    this._router.navigate([], { queryParams: null, replaceUrl: true })
  }
}
