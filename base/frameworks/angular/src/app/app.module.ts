import { versionName } from 'src/version';
console.log(`Version: ${versionName}`);

/* -------------------- */

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { SuccessInterceptor } from './interceptors/success.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { CachingInterceptor } from './interceptors/caching.interceptor';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NgxMaskModule } from 'ngx-mask';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { MockInterceptor } from './interceptors/mock.interceptor';
import { initializeApp, InitService } from './services/init.service';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NzMessageModule,
    NzNotificationModule,
    NgxMaskModule.forRoot({ validation: true, thousandSeparator: '.' }),
    NgxWebstorageModule.forRoot({ prefix: 'app', separator: '.', caseSensitive: true }),
  ],
  providers: [
    { provide: NZ_I18N, useValue: es_ES },
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [InitService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, deps: [AuthService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SuccessInterceptor, deps: [AuthService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, deps: [AuthService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, deps: [StorageService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
