// import { Injectable } from '@angular/core';
// import { defaultTo } from 'lodash';
// import { Preferences } from '@capacitor/preferences';
// import { AbstractStorageService } from './abstract-storage.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class PreferencesStorageService extends AbstractStorageService {

//   protected override async _get(key: string): Promise<any> {
//     return Promise.resolve(defaultTo(this._decodeValue((await Preferences.get({ key }))?.value), undefined));
//   }

//   protected override async _set(key: string, value: any): Promise<void> {
//     await Preferences.set({ key, value: this._encodeValue(value) });
//   }

//   protected override async _remove(key: string): Promise<void> {
//     await Preferences.remove({ key });
//   }

//   protected override async _clear(): Promise<void> {
//     await Preferences.clear();
//   }
// }
