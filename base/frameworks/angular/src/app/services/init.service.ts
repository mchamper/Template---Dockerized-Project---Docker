/** version: 1 */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthSystemUserHttpService } from './http/auth-system-user-http.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
    @Inject(DOCUMENT) private _dom: Document,
    private _storeS: StoreService,
    private _authSystemUserHttpS: AuthSystemUserHttpService,
  ) { }

  /* -------------------- */

  async init(): Promise<void> {
    const preloaderContentDivElem = this._dom.querySelector<HTMLElement>('#preloaderContent > div');
    if (preloaderContentDivElem) preloaderContentDivElem.innerHTML = `v${environment.version}`;

    const storage: number = parseInt(localStorage.getItem('storage') || '1');

    if (!storage || storage !== environment.storage) {
      localStorage.clear();
      localStorage.setItem('storage', environment.storage + '');
    }

    /* -------------------- */

    return Promise.all([
      this.resolveAuthSystemUser(),
    ])
    .then(() => this.continue())
    .catch(() => this.throwError());
  }

  continue() {
    this._dom.querySelector<HTMLElement>('body')?.classList.add('ready');
    this._dom.querySelector<HTMLElement>('#preloader')?.remove();

    return Promise.resolve();
  }

  throwError() {
    const errorMessage = 'An error has ocurred.';
    const preloaderContentElem = this._dom.querySelector<HTMLElement>('#preloaderContent');

    if (preloaderContentElem) preloaderContentElem.innerHTML = errorMessage;

    return Promise.reject(errorMessage);
  }

  /* -------------------- */

  async resolveAuthSystemUser(): Promise<void> {
    if (this._storeS.authSystemUser.value?.isLoggedIn()) {
      await firstValueFrom(this._authSystemUserHttpS.me()).catch(() => null);
    }

    return Promise.resolve();
  }
}
