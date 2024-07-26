import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormModule } from '../../../core/features/form/form.module';
import { Request } from '../../../core/features/request/request.class';
import { AuthUserVerificationHttpService } from '../../../services/http/auth-user-verification-http.service';
import { AuthService } from '../../../services/auth.service';
import { injectQueryParams } from 'ngxtension/inject-query-params';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzAlertModule,
  ],
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerificationComponent {

  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _authUserVerificationHttpS = inject(AuthUserVerificationHttpService);
  authS = inject(AuthService);

  hash = injectQueryParams('verificationHash');

  requestRequest = new Request({
    send: () => this._authUserVerificationHttpS.request('systemUser'),
    notify: true,
  });

  verifyRequest = new Request({
    send: () => this._authUserVerificationHttpS.verify('systemUser', this.hash()!),
    success: () => this.clearHashFromUrl(),
    notify: true,
  });

  constructor() {
    if (this.hash() && !this.authS.systemUser().activeSession()!.isVerified()) {
      this.verifyRequest.run();
    } else {
      this.clearHashFromUrl();
    }
  }

  /* -------------------- */

  clearHashFromUrl() {
    this._router.navigate([], { queryParams: null, replaceUrl: true });
  }
}
