import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { delay, firstValueFrom, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { versionName } from 'src/version';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

export const initializeApp = (initS: InitService) => {
  return () => initS.init();
}

@Injectable({
  providedIn: 'root'
})
export class InitService {

  errorMessage: string = 'Ha ocurrido un error.';

  constructor(
    @Inject(DOCUMENT) private _dom: Document,
    private _storageS: StorageService,
    private _authS: AuthService,
  ) { }

  /* -------------------- */

  async init(): Promise<void> {
    const preloaderAppVersionElem = this._dom.querySelector<HTMLElement>('#preloaderAppVersion');
    if (preloaderAppVersionElem) preloaderAppVersionElem.innerHTML = `${versionName}`;

    this.checkStorage();

    return Promise.all([
      this.checkAuthClient(),
      this.checkAuthUser(),
      // this._delay(),
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
    const preloaderContentElem = this._dom.querySelector<HTMLElement>('#preloaderContent');
    if (preloaderContentElem) preloaderContentElem.innerHTML = this.errorMessage;

    return Promise.reject(this.errorMessage);
  }

  /* -------------------- */

  checkStorage(): void {
    const storageVersion: number = this._storageS.get('storageVersion');

    if (!storageVersion || storageVersion !== environment.storageVersion) {
      this._storageS.clear();
      this._storageS.clearSession();

      this._storageS.set('storageVersion', environment.storageVersion);
    }
  }

  /* -------------------- */

  async checkAuthClient(): Promise<void> {
    if (this._authS.isLoggedIn('client')) {
      await firstValueFrom(of('this._authClientHttpS.me()')).catch(() => null);
    }

    return Promise.resolve();
  }

  async checkAuthUser(): Promise<void> {
    if (this._authS.isLoggedIn('user')) {
      await firstValueFrom(of('this._authUserHttpS.me()')).catch(() => null);
    }

    return Promise.resolve();
  }

  async _delay(seconds: number = 3): Promise<void> {
    if (!environment.production) {
      await firstValueFrom(of(true).pipe(delay(seconds * 1000)));
    }

    return Promise.resolve();
  }
}
