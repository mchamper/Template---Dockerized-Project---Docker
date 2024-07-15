import { Injectable, Injector, inject } from '@angular/core';
import { State } from '../states/state';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';
import { versionName } from '../../version';
import { AuthService } from './auth.service';
import { UiState } from '../states/ui.state';
import { DOCUMENT } from '@angular/common';
import { LangService } from './lang.service';
import { kebabCase } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private _translateS = inject(TranslateService);
  private _storageS = inject(StorageService);
  private _langS = inject(LangService);
  private _authS = inject(AuthService);
  private _dom = inject(DOCUMENT);
  private _injector = inject(Injector);
  private _state!: State;
  private _uiState!: UiState;

  async init(): Promise<void> {
    console.log(`Version: ${versionName}`);

    try {
      await this._storageS.init(),
      await this._langS.init();
      await this._authS.init();

      this._state = this._injector.get(State);
      this._uiState = this._injector.get(UiState);

      await Promise.all([
        this.resolveDeviceInfo(),
      ]);

      return Promise.resolve();
    } catch (err) {
      let errorMessage = this._translateS.instant('init.errors.default');
      errorMessage += typeof err === 'number' ? ` (${err})` : ` (${JSON.stringify(err)})`;

      return Promise.reject(errorMessage);
    }
  }

  /* -------------------- */

  async resolveDeviceInfo(): Promise<void> {
    try {
      // const deviceId = (await Device.getId()).identifier;
      // const deviceInfo = await Device.getInfo();
      // const deviceLang = (await Device.getLanguageCode()).value;

      // this._dom.body.classList.add('device-platform-' + kebabCase(this._state.device()!.platform));
      // this._dom.body.classList.add('device-os-version-' + kebabCase(this._state.device()!.osVersion));
      // this._dom.body.classList.add('device-model-' + kebabCase(this._state.device()!.model));
    } catch (err) {
      return Promise.reject(0);
    }

    // return Promise.reject(0);
    return Promise.resolve();
  }
}
