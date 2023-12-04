import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { delay, firstValueFrom, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { versionName } from 'src/version';
import { AuthService } from './auth.service';
import { AuthSystemUserHttpService } from './http/auth-system-user-http.service';
import { AuthAppClientHttpService } from './http/auth-app-client-http.service';

export const initializeApp = (initS: InitService) => {
  return () => initS.init();
}

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
    @Inject(DOCUMENT) private _dom: Document,
    private _authS: AuthService,
    private _authAppClientHttpS: AuthAppClientHttpService,
    private _authSystemUserHttpS: AuthSystemUserHttpService,
  ) { }

  /* -------------------- */

  async init(): Promise<void> {
    const preloaderAppVersionElem = this._dom.querySelector<HTMLElement>('#preloaderAppVersion');
    if (preloaderAppVersionElem) preloaderAppVersionElem.innerHTML = `${versionName}`;

    try {
      await this.checkAuthAppClient();

      await Promise.all([
        this.checkAuthSystemUser(),
      ]);

      return this.continue();
    } catch (err) {
      return this.throwError();
    }
  }

  continue() {
    this._dom.querySelector<HTMLElement>('body')?.classList.add('ready');
    this._dom.querySelector<HTMLElement>('#preloader')?.remove();

    return Promise.resolve();
  }

  throwError(message?: string) {
    message = message || 'Ha ocurrido un error.'

    const preloaderContentElem = this._dom.querySelector<HTMLElement>('#preloaderContent');
    if (preloaderContentElem) preloaderContentElem.innerHTML = message;

    return Promise.reject(message);
  }

  /* -------------------- */

  async checkAuthAppClient(): Promise<void> {
    if (this._authS.appClient().isLoggedIn()) {
      await firstValueFrom(this._authAppClientHttpS.me());
    }
    else {
      await firstValueFrom(this._authAppClientHttpS.login({
        key: environment.backendAppClientKey,
        secret: environment.backendAppClientSecret,
      }));
    }

    return Promise.resolve();
  }

  async checkAuthSystemUser(): Promise<void> {
    if (this._authS.systemUser().isLoggedIn()) {
      await firstValueFrom(this._authSystemUserHttpS.me()).catch(() => null);
    }

    return Promise.resolve();
  }

  /* -------------------- */

  async _delay(seconds: number = 3): Promise<void> {
    if (!environment.production) {
      await firstValueFrom(of(true).pipe(delay(seconds * 1000)));
    }

    return Promise.resolve();
  }
}
