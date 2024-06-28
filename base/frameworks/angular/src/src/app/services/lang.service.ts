import { Injectable, inject, signal } from '@angular/core';
import { State } from '../states/state';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  private _translateS = inject(TranslateService)
  private _state = inject(State);

  readonly availableLangs = ['en', 'es'];
  readonly defaultLang = 'es';

  langToUse = signal<string>(this.defaultLang);

  init(lang?: string): Promise<void> {
    if (lang) {
      lang = lang.toLowerCase();

      if (this.availableLangs.includes(lang)) {
        this.langToUse.set(lang);
      }
    }

    this._state.lang.set(this.langToUse());

    return firstValueFrom(this._translateS.use(this._state.lang()));
  }
}
