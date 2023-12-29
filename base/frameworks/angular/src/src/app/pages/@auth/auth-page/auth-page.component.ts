import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthPageLoginComponent } from './auth-page-login/auth-page-login.component';
import { AuthPageRegisterComponent } from './auth-page-register/auth-page-register.component';
import { AuthPagePasswordResetRequestComponent } from './auth-page-password-reset-request/auth-page-password-reset-request.component';
import { AuthPagePasswordResetUpdateComponent } from './auth-page-password-reset-update/auth-page-password-reset-update.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzListModule } from 'ng-zorro-antd/list';
import { AuthService } from '../../../services/auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Request } from '../../../core/features/request/request.class';
import { AuthSystemUserHttpService } from '../../../services/http/auth-system-user-http.service';
import { RequestComponent } from '../../../core/features/request/components/request/request.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuthPageLoginComponent,
    AuthPageRegisterComponent,
    AuthPagePasswordResetRequestComponent,
    AuthPagePasswordResetUpdateComponent,
    RequestComponent,
    NzTabsModule,
    NzListModule,
    NzAvatarModule,
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AuthPageComponent {

  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _authSystemUserHttpS = inject(AuthSystemUserHttpService);
  authS = inject(AuthService);

  passwordResetHash = this._route.snapshot.queryParamMap.get('passwordResetHash') || undefined;
  redirectTo = this._route.snapshot.queryParamMap.get('redirectTo') || undefined;

  sessionRefreshRequest = new Request({
    send: () => this._authSystemUserHttpS.me(),
  });

  /* -------------------- */

  selectSession(index: number) {
    this.authS.systemUser().selectSession(index, false);
    this.sessionRefreshRequest.run();
  }

  enter() {
    this._router.navigateByUrl(this.redirectTo || '/');
  }
}
