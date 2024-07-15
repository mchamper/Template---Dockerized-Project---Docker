import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
registerLocaleData(es);
/* -------------------- */
import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
/* -------------------- */
import { requestInterceptor } from './core/interceptors/request.interceptor';
import { successInterceptor } from './core/interceptors/success.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
/* -------------------- */
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzConfig } from 'ng-zorro-antd/core/config';
import { nzConfig } from './configs/nz.config';
/* -------------------- */
import { provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig } from 'ngx-webstorage';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { register as swiperRegisterCustomElements } from 'swiper/element/bundle';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateBrowserLoader } from './core/loaders/translate-browser.loader';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
/* -------------------- */
import { InitService } from './services/init.service';

/* -------------------- */

swiperRegisterCustomElements();

export function initializeApp(initS: InitService) {
  return (): Promise<any> => initS.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [InitService], multi: true },
    { provide: LOCALE_ID, useFactory: (translate: TranslateService) => translate.currentLang ? translate.currentLang : 'es', deps: [TranslateService] },
    { provide: APP_BASE_HREF, useValue: '/' },
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      }),
      withComponentInputBinding()
    ),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: false,
      })
    ),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        requestInterceptor,
        successInterceptor,
        errorInterceptor,
      ]),
    ),
    provideNzI18n(es_ES),
    provideNzConfig(nzConfig),
    provideEnvironmentNgxMask({ validation: true, thousandSeparator: '.' }),
    provideNgxWebstorage(
      withNgxWebstorageConfig({ prefix: 'app', separator: '.', caseSensitive: true }),
      withLocalStorage(),
    ),
    importProvidersFrom(
      [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => new TranslateBrowserLoader(),
          },
          defaultLanguage: 'es',
        }),
      ]
    ),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.authGoogleClientId || '', {
              oneTapEnabled: false,
            })
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
  ],
};
