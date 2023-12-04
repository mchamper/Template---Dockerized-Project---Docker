import { Injectable } from '@angular/core';
import { SystemUser } from '../models/system-user.model';
import { AbstractAuthService } from '../core/services/abstract-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AbstractAuthService {

  constructor() {
    super();

    this._init([
      { guard: 'appClient' },
      { guard: 'systemUser', modelClass: SystemUser },
    ]);
  }

  override systemUser() {
    return this.guard<SystemUser>('systemUser');
  }
}
