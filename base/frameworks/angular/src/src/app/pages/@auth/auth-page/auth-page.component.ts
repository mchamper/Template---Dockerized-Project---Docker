import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordResetRequestComponent } from './password-reset-request/password-reset-request.component';
import { PasswordResetUpdateComponent } from './password-reset-update/password-reset-update.component';
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
    LoginComponent,
    RegisterComponent,
    PasswordResetRequestComponent,
    PasswordResetUpdateComponent,
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
