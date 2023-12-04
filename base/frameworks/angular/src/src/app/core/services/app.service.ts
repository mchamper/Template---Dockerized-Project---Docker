import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _location = inject(Location);

  /* -------------------- */

  reload(): void {
    window.location.reload();
  }

  back(): void {
    this._location.back();
  }
}
