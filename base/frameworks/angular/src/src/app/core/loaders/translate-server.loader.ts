import { StateKey, TransferState, inject, makeStateKey } from "@angular/core";
import { TranslateLoader } from "@ngx-translate/core";
import { join } from "path";
import { Observable } from "rxjs";
import * as fs from 'fs';
import { environment } from "../../../environments/environment";

export class TranslateServerLoader implements TranslateLoader {

  private _transferState = inject(TransferState);

  /* -------------------- */

  getTranslation(lang: string): Observable<any> {
    return new Observable((observer) => {
      const folder = environment.production
        // ? join(process.cwd(), 'dist', 'app', 'browser', 'public', 'i18n')
        ? join(process.cwd(), 'public', 'i18n')
        : join(process.cwd(), 'public', 'i18n');

      const jsonData = JSON.parse(fs.readFileSync(`${folder}/${lang}.json`, 'utf8'));

      // Here we save the translations in the transfer-state
      const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);
      this._transferState.set(key, jsonData);

      observer.next(jsonData);
      observer.complete();
    });
  }
}
