import { ChangeDetectionStrategy, Component, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TaxonomyService } from './core/services/taxonomy.service';
import { State } from './states/state';
import { taxonomies } from './app.taxonomies';
import { UiState } from './states/ui.state';
import { AuthService } from './services/auth.service';
import { versionName } from '../version';
import { firstValueFrom } from 'rxjs';
import { AuthAppClientHttpService } from './services/http/auth-app-client-http.service';
import { environment } from '../environments/environment';
import { AuthSystemUserHttpService } from './services/http/auth-system-user-http.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  private _taxonomyS = inject(TaxonomyService);
  private _translateS = inject(TranslateService);
  private _authS = inject(AuthService);
  private _authAppClientHttpS = inject(AuthAppClientHttpService);
  private _authSystemUserHttpS = inject(AuthSystemUserHttpService);

  state = inject(State);
  uiState = inject(UiState);

  constructor() {
    console.log(`Version: ${versionName}`);
    this._taxonomyS.init(taxonomies);
  }

  async ngOnInit() {
    //

    /* -------------------- */

    try {
      await this.checkAuthAppClient();

      await Promise.all([
        this.resolveLang(),
      ]);

      await Promise.all([
        this.checkAuthSystemUser(),
      ]);

      this.state.app.setReady();
    } catch (err) {
      this.state.app.setError(err as string);
    }
  }

  /* -------------------- */

  async resolveLang(): Promise<void> {
    try {
      await firstValueFrom(this._translateS.use(this.state.lang()));
    } catch (err) {
      // return Promise.reject('No se ha podido establecer el idioma.');
      // return Promise.reject('Ha ocurrido un error.');
    }

    return Promise.resolve();
  }

  /* -------------------- */

  async checkAuthAppClient(): Promise<void> {
    try {
      if (this._authS.appClient().activeSession()) {
        await firstValueFrom(this._authAppClientHttpS.me());
      }
      else {
        await firstValueFrom(this._authAppClientHttpS.login({
          key: environment.backendAppClientKey,
          secret: environment.backendAppClientSecret,
        }));
      }
    } catch (err) {
      return Promise.reject('No se ha podido verificar la identidad del cliente de aplicación.');
    }

    return Promise.resolve();
  }

  async checkAuthSystemUser(): Promise<void> {
    try {
      if (this._authS.systemUser().activeSession()) {
        await firstValueFrom(this._authSystemUserHttpS.me());
      }
    } catch (err) {
      return Promise.reject('No se ha podido verificar la identidad del usuario de sistema.');
    }

    return Promise.resolve();
  }
}
