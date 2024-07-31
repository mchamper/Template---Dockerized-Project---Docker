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

  private _injector = inject(Injector);
  private _translateS = inject(TranslateService);
  private _storageS = inject(StorageService);
  private _dom = inject(DOCUMENT);

  private _state!: State;
  private _uiState!: UiState;

  async init(): Promise<void> {
    console.log(`Version: ${versionName}`);

    try {
      await this._storageS.init();
      this._state = this._injector.get(State);
      this._uiState = this._injector.get(UiState);

      await this._injector.get(AuthService).init();
      await this._injector.get(LangService).init();

      await Promise.all([
        this.resolveDeviceInfo(),
      ]);

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
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
