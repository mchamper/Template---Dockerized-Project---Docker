import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SsrService {

  private _platformId = inject<string>(PLATFORM_ID);

  /* -------------------- */

  isBrowser = () => isPlatformBrowser(this._platformId);
  isServer = () => isPlatformServer(this._platformId);
}
