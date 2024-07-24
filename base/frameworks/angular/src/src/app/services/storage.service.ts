import { Injectable } from '@angular/core';
import { WebStorageService } from '../core/services/storage/web-storage.service';
// import { PreferencesStorageService } from '../core/services/storage/preferences-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService extends WebStorageService {
// export class StorageService extends PreferencesStorageService {

  protected override _version = 1;
}
