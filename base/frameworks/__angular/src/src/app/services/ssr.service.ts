import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SsrService {

  constructor(
    @Inject(PLATFORM_ID) private _platformId: string,
  ) { }

  isBrowser = () => isPlatformBrowser(this._platformId);
  isServer = () => isPlatformServer(this._platformId);
}
