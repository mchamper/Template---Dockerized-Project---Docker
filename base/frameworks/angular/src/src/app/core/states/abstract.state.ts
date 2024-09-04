import { Injectable, Injector, inject } from '@angular/core';
import { StorageService } from '../../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractState {

  protected _injector = inject(Injector);
  protected _storageS = inject(StorageService);
}
