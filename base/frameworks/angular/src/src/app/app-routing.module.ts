import { ViewportScroller } from '@angular/common';
import { NgModule } from '@angular/core';
import { Event, Router, RouterModule, Routes, Scroll } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { filter } from 'rxjs';
import { AuthTplComponent } from './components/templates/auth-tpl/auth-tpl.component';
import { MainTplComponent } from './components/templates/main-tpl/main-tpl.component';
import { AuthUserIsLoggedInGuard } from './guards/auth-user-is-logged-in.guard';
import { AuthUserIsNotLoggedInGuard } from './guards/auth-user-is-not-logged-in.guard';
import { RouteService } from './services/route.service';
import { TaxonomyService } from './taxonomies/taxonomy.service';

const routes: Routes = [
  {
    path: '',
    component: MainTplComponent,
    canActivateChild: [AuthSystemUserIsLoggedInGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthSystemUserIsVerifiedGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/home-page/home-page.component'), data: { name: 'HomePage' } },
          { path: 'usuarios', loadComponent: () => import('./pages/system-users-page/system-users-page.component'), data: { name: 'SystemUsersPage' } },
          { path: 'usuarios/crear', loadComponent: () => import('./pages/system-user-create-page/system-user-create-page.component'), data: { name: 'SystemUserCreatePage' } },
          { path: 'usuarios/:systemUserId', loadComponent: () => import('./pages/system-user-detail-page/system-user-detail-page.component'), data: { name: 'SystemUserDetailPage' } },
        ],
      },
      { path: 'cuenta', loadComponent: () => import('./pages/account-page/account-page.component'), data: { name: 'AccountPage' } },
    ],
    data: { groupName: 'MainTpl' }
  },
  /* -------------------- */
  {
    path: '',
    component: AuthTplComponent,
    canActivateChild: [AuthSystemUserIsNotLoggedInGuard],
    children: [
      { path: 'bienvenido', loadComponent: () => import('./pages/@auth/auth-page/auth-page.component'), data: { name: 'AuthPage' } },
    ],
    data: { groupName: 'AuthTpl' }
  },
  /* -------------------- */
  { path: '**', loadComponent: () => import('./pages/@errors/not-found-page/not-found-page.component'), data: { name: 'ErrorNotFoundPage' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
    // Esta opción no restaura el scroll cuando se refresca la página.
    // scrollPositionRestoration: 'enabled',
})],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(
    viewportScroller: ViewportScroller,
    router: Router,
    routeS: RouteService,
    gtmService: GoogleTagManagerService,
    taxonomyS: TaxonomyService,
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

    routeS.currentPage$.subscribe((value) => {
      taxonomyS.resolve(value);

      gtmService.pushTag({
        event: 'page',
        pageName: value.url
      });
    });
  }
}
