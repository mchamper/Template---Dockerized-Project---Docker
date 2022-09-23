import { StoreService } from "src/app/services/store.service";

export interface IAuthSystemUser {
  systemUser: any;
  token: string | undefined;
}

export class AuthSystemUser implements IAuthSystemUser {

  systemUser: any;
  token: string | undefined;

  /* -------------------- */

  constructor(value: IAuthSystemUser) {
    Object.assign(this, value);
  }

  /* -------------------- */

  isLoggedIn(): boolean {
    return !!this.systemUser && !!this.token;
  }

  /* -------------------- */

  logout(storeS: StoreService): void {
    storeS.remove('authSystemUser', { emit: 'logout' });
  }
}
