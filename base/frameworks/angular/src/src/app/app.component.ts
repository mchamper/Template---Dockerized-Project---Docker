import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TaxonomyService } from './core/services/taxonomy.service';
import { State } from './states/state';
import { taxonomies } from './app.taxonomies';
import { UiState } from './states/ui.state';
import { AuthService } from './services/auth.service';
import { firstValueFrom } from 'rxjs';
import { AuthAppClientHttpService } from './services/http/auth-app-client-http.service';
import { environment } from '../environments/environment';
import { AuthSystemUserHttpService } from './services/http/auth-system-user-http.service';
import moment from 'moment';
import { routeSlideUpAnimation } from './core/utils/animations/route.animation';
import { fadeOutAnimation } from './core/utils/animations/fade.animation';
import { RouteService } from './core/services/route.service';

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
  animations: [
    routeSlideUpAnimation(),
    fadeOutAnimation(),
  ]
})
export class AppComponent {

  private _taxonomyS = inject(TaxonomyService);
  private _authS = inject(AuthService);
  private _authAppClientHttpS = inject(AuthAppClientHttpService);
  private _authSystemUserHttpS = inject(AuthSystemUserHttpService);
  routeS = inject(RouteService);
  state = inject(State);
  uiState = inject(UiState);

  constructor() {
    this._authS.initEffects();
    this._taxonomyS.init(taxonomies);
  }

  async ngOnInit() {
    //

    /* -------------------- */

    try {
      const timeStart = moment();

      await this.checkAuthAppClient();

      await Promise.all([
        this.checkAuthSystemUser(),
      ]);

      const timeFinish = moment();
      const timeElapsed = timeFinish.diff(timeStart);

      setTimeout(() => {
        this.state.app.setReady();
      }, (timeElapsed >= 2000 ? 0 : 2000 - timeElapsed) + 300);
    } catch (err) {
      this.state.app.setError(err as string);
    }
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
      // return Promise.reject('No se ha podido verificar la identidad del usuario de sistema.');
    }



    return Promise.resolve();
  }
}
