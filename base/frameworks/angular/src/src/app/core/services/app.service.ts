import { Location } from '@angular/common';
import { Injectable, NgZone, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  protected _ngZone = inject(NgZone);
  protected _location = inject(Location);

  /* -------------------- */

  reload(): void {
    window.location.reload();
  }

  back(): void {
    this._location.back();
  }
}
