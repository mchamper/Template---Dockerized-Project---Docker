import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
registerLocaleData(es);
/* -------------------- */
import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
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
import { NgxWebstorageModule } from 'ngx-webstorage';
import { provideEnvironmentNgxMask } from 'ngx-mask';
/* -------------------- */
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LOCALE_ID, useValue: 'es' },
    provideRouter(routes, withComponentInputBinding()),
    // provideClientHydration(
    //   withHttpTransferCacheOptions({
    //     includePostRequests: false,
    //   })
    // ),
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
    importProvidersFrom(NgxWebstorageModule.forRoot({ prefix: 'app', separator: '.', caseSensitive: true })),
    provideEnvironmentNgxMask({ validation: true, thousandSeparator: '.' }),
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
