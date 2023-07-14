import { versionName } from 'src/version';
console.log(`Version: ${versionName}`);

/* -------------------- */

import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitService, initializeApp } from './services/init.service';
import { AuthService } from './services/auth.service';
import { environment } from 'src/environments/environment';

import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
// import { GoogleTagManagerModule } from 'angular-google-tag-manager';
// import { PixelModule } from 'ngx-pixel';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { TransferHttpCacheModule } from '@nguniversal/common';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { SuccessInterceptor } from './interceptors/success.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);

const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#972640',
  },
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    // TransferHttpCacheModule,
    NzMessageModule,
    NzNotificationModule,
    NzModalModule,
    NgxWebstorageModule.forRoot({ prefix: 'app', separator: '.', caseSensitive: true }),
    // GoogleTagManagerModule.forRoot({ id: environment.gtmId }),
    // PixelModule.forRoot({ enabled: true, pixelId: environment.fbPixelId }),
  ],
  providers: [
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
    provideEnvironmentNgxMask({ validation: true, thousandSeparator: '.' }),
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    { provide: NZ_I18N, useValue: es_ES },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [InitService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, deps: [AuthService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SuccessInterceptor, deps: [AuthService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, deps: [AuthService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
