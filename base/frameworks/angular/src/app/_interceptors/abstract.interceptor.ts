import { HttpRequest } from "@angular/common/http";
import { AuthSystemUser } from "../core/auth-system-user/auth-system-user.model";
import { NavService } from "../services/nav.service";
import { StoreKey, StoreService } from "../services/store.service";
import { AUTH_STORE_KEY } from "./contexts";

export abstract class AbstractInterceptor {

  protected _auth!: AuthSystemUser;

  constructor(
    protected _storeS: StoreService,
    protected _navS: NavService,
  ) { }

  resolveAuth(req: HttpRequest<any>) {
    if ((['authSystemUser'] as StoreKey[]).includes(req.context.get(AUTH_STORE_KEY))) {
      this._auth = this._storeS[req.context.get(AUTH_STORE_KEY)].value;
    }
  }
}
