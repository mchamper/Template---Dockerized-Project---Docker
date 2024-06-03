// import { Injectable } from '@angular/core';
// import { defaultTo } from 'lodash';
// import { base64Decode, base64Encode } from '../../utils/helpers/hash.helper';
// import { Preferences } from '@capacitor/preferences';
// import { AbstractStorageService, TStoreOptions } from './abstract-storage.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class PreferencesStorageService extends AbstractStorageService {

//   override async get(key: string, options?: TStoreOptions): Promise<any> {
//     let value = (await Preferences.get({ key }))?.value;

//     if (value) {
//       try {
//         value = options?.base64
//           ? base64Decode(value)
//           : JSON.parse(value);
//       } catch (err) {
//         value = null;
//       }
//     }

//     return Promise.resolve(defaultTo(value, null));
//   }

//   override async set(key: string, value: any, options?: TStoreOptions): Promise<void> {
//     value = options?.base64
//       ? base64Encode(value)
//       : JSON.stringify(value);

//     await Preferences.set({ key, value });
//   }

//   override async remove(key: string): Promise<void> {
//     await Preferences.remove({ key });
//   }

//   override async clear(): Promise<void> {
//     await Preferences.clear();
//   }
// }
