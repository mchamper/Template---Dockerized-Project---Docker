// import { Injectable } from '@angular/core';
// import { defaultTo } from 'lodash';
// import { base64Decode, base64Encode } from '../../utils/helpers/hash.helper';
// import { Preferences } from '@capacitor/preferences';
// import { AbstractStorageService } from './abstract-storage.service';
// import { coreConfig } from '../../../configs/core.config';

// @Injectable({
//   providedIn: 'root'
// })
// export class PreferencesStorageService extends AbstractStorageService {

//   override async get(key: string): Promise<any> {
//     if (this._ssrS.isServer()) return;

//     let value = (await Preferences.get({ key }))?.value;

//     if (value) {
//       try {
//         value = coreConfig.storage.base64
//           ? base64Decode(value)
//           : JSON.parse(value);
//       } catch (err) {
//         value = null;
//       }
//     }

//     return Promise.resolve(defaultTo(value, null));
//   }

//   override async set(key: string, value: any): Promise<void> {
//     if (this._ssrS.isServer()) return;

//     value = coreConfig.storage.base64
//       ? base64Encode(value)
//       : JSON.stringify(value);

//     await Preferences.set({ key, value });
//   }

//   override async remove(key: string): Promise<void> {
//     if (this._ssrS.isServer()) return;

//     await Preferences.remove({ key });
//   }

//   override async clear(): Promise<void> {
//     if (this._ssrS.isServer()) return;

//     await Preferences.clear();
//   }
// }
