import { HttpBackend, HttpClient } from "@angular/common/http";
import { StateKey, TransferState, inject, makeStateKey } from "@angular/core";
import { TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable } from "rxjs";
import { versionCode } from "../../../version";

export class TranslateBrowserLoader implements TranslateLoader {

  private _httpBackend = inject(HttpBackend);
  private _transferState = inject(TransferState);

  /* -------------------- */

  getTranslation(lang: string): Observable<any> {
    const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);
    const data = this._transferState.get(key, null);

    // First we are looking for the translations in transfer-state,
    // if none found, http load as fallback
    if (data) {
      return new Observable((observer) => {
        observer.next(data);
        observer.complete();
      });
    } else {
      return new TranslateHttpLoader(
        new HttpClient(this._httpBackend),
        './public/i18n/', '.json?version=' + versionCode
      ).getTranslation(lang);
    }
  }
}
