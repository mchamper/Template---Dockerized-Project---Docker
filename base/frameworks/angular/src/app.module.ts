import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData, ViewportScroller } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { InitService } from './services/init.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { Event, Router, Scroll } from '@angular/router';
import { filter } from 'rxjs';
import { CachingInterceptor } from './interceptors/caching.interceptor';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { SuccessInterceptor } from './interceptors/success.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { StoreService } from './services/store.service';
import { NavService } from './services/nav.service';

console.info('Version:', environment.version);

registerLocaleData(en);

export function appInit(initService: InitService) {
  return (): Promise<any> => {
    return initService.init();
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NzMessageModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: APP_INITIALIZER, useFactory: appInit, deps: [InitService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, deps: [StoreService, NavService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SuccessInterceptor, deps: [StoreService, NavService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, deps: [StoreService, NavService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, deps: [StoreService, NavService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    router: Router,
    viewportScroller: ViewportScroller,
  ) {

    router.events.pipe(
      filter((e: Event): e is Scroll => e instanceof Scroll),
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor);
      } else {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
