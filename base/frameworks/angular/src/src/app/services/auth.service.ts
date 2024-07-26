import { Injectable, Injector, inject } from '@angular/core';
import { SystemUser } from '../models/system-user.model';
import { AbstractAuthService } from '../core/services/abstract-auth.service';
import { firstValueFrom } from 'rxjs';
import { AuthUserHttpService } from './http/auth-user-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AbstractAuthService {

  private _injector = inject(Injector);

  async init(): Promise<void> {
    await this._init([
      { guard: 'systemUser', modelClass: SystemUser },
    ]);

    // setInterval(async () => {
    //   if (this.user().activeSession()?.refreshToken) {
    //     await firstValueFrom(this._injector.get(AuthSystemUserHttpService).refreshToken());
    //   }
    // }, 1000 * 60 * 5);
  }

  /* -------------------- */

  override systemUser() {
    return this.guard<SystemUser>('systemUser');
  }
}
