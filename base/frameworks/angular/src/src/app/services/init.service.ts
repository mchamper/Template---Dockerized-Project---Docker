import { Injectable, Injector, inject } from '@angular/core';
// import { Device } from '@capacitor/device';
import { State } from '../states/state';
import { UiState } from '../states/ui.state';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { versionName } from '../../version';
import { AuthService } from './auth.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private _translateS = inject(TranslateService);
  private _storageS = inject(StorageService);
  private _authS = inject(AuthService);
  private _injector = inject(Injector);
  private _dom = inject(DOCUMENT);

  private _state!: State;
  private _uiState!: UiState;

  async init(): Promise<void> {
    console.log(`Version: ${versionName}`);

    try {
      await this._storageS.init(),
      await this._authS.init();

      this._state = this._injector.get(State);
      this._uiState = this._injector.get(UiState);

      await Promise.all([
        this.resolveDeviceInfo(),
      ]);

      await Promise.all([
        this.resolveLang(),
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

      // this._state.device.set({
      //   id: deviceId,
      //   platform: deviceInfo.platform,
      //   osVersion: deviceInfo.osVersion.match(/([0-9\.]+)/)?.at(0) + '',
      //   model: deviceInfo.model,
      //   lang: deviceLang
      // });

      // this._dom.body.classList.add('device-platform-' + this._state.device()!.platform);
      // this._dom.body.classList.add('device-os-version-' + this._state.device()!.osVersion);
      // this._dom.body.classList.add('device-model-' + this._state.device()!.model);
    } catch (err) {
      return Promise.reject(0);
    }

    // return Promise.reject(0);
    return Promise.resolve();
  }

  async resolveLang(): Promise<void> {
    try {
      // this._state.lang.set(this._state.device()!.lang);
      await firstValueFrom(this._translateS.use(this._state.lang()));
    } catch (err) {
      // return Promise.reject(1);
    }

    // return Promise.reject(1);
    return Promise.resolve();
  }
}
