import { Injectable, Injector, inject } from '@angular/core';
// import { Device } from '@capacitor/device';
import { State } from '../states/state';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { versionName } from '../../version';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private _storageS = inject(StorageService);
  private _authS = inject(AuthService);
  private _injector = inject(Injector);

  private _state!: State;
  private _translateS!: TranslateService;

  async init(): Promise<void> {
    console.log(`Version: ${versionName}`);

    try {
      await this._storageS.init(),
      await this._authS.init();

      this._state = this._injector.get(State);
      this._translateS = this._injector.get(TranslateService);

      await Promise.all([
        this.resolveDeviceInfo(),
      ]);

      await Promise.all([
        this.resolveLang(),
      ]);
    } catch (err) {
      return Promise.reject('Ha ocurrido un error: ' + err);
    }

    return Promise.resolve();
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
    } catch (err) {
      // return Promise.reject('No se ha podido obtener la información del dispositivo.');
      // return Promise.reject('Ha ocurrido un error.');
    }

    return Promise.resolve();
  }

  async resolveLang(): Promise<void> {
    try {
      // this._state.lang.set(this._state.device()!.lang);
      await firstValueFrom(this._translateS.use(this._state.lang()));
    } catch (err) {
      // return Promise.reject('No se ha podido establecer el idioma.');
      // return Promise.reject('Ha ocurrido un error.');
    }

    return Promise.resolve();
  }
}
