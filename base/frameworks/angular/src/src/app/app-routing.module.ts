import { ViewportScroller } from '@angular/common';
import { NgModule } from '@angular/core';
import { Event, Router, RouterModule, Routes, Scroll } from '@angular/router';
import { filter } from 'rxjs';
import { AuthTplComponent } from './components/templates/auth-tpl/auth-tpl.component';
import { MainTplComponent } from './components/templates/main-tpl/main-tpl.component';
import { authSystemUserIsLoggedInGuard } from './guards/auth-system-user-is-logged-in.guard';
import { authSystemUserIsNotLoggedInGuard } from './guards/auth-system-user-is-not-logged-in.guard';
import { authSystemUserIsVerifiedGuard } from './guards/auth-system-user-is-verified.guard';
import { RouteService } from './services/route.service';
import { TaxonomyService } from './taxonomies/taxonomy.service';
import { toObservable } from '@angular/core/rxjs-interop';
// import { GoogleTagManagerService } from 'angular-google-tag-manager';

const routes: Routes = [
  {
    path: '',
    component: MainTplComponent,
    canActivateChild: [authSystemUserIsLoggedInGuard()],
    children: [
      {
        path: '',
        canActivateChild: [authSystemUserIsVerifiedGuard()],
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/home-page/home-page.component'),
            data: { name: 'HomePage' }
          },
          {
            path: 'usuarios',
            loadComponent: () => import('./pages/system-users-page/system-users-page.component'),
            data: { name: 'SystemUsersPage', permissions: ['SystemUserGet', 'SystemUserUpdate'] }
          },
          {
            path: 'usuarios/crear',
            loadComponent: () => import('./pages/system-user-create-page/system-user-create-page.component'),
            data: { name: 'SystemUserCreatePage', permissions: ['SystemUserCreate'] },
          },
          {
            path: 'usuarios/:systemUserId',
            loadComponent: () => import('./pages/system-user-detail-page/system-user-detail-page.component'),
            data: { name: 'SystemUserDetailPage', permissions: ['SystemUserGet', 'SystemUserUpdate'] }
          },
        ],
      },
      {
        path: 'cuenta',
        loadComponent: () => import('./pages/account-page/account-page.component'),
        data: { name: 'AccountPage' }
      },
    ],
    data: { groupName: 'MainTpl' }
  },
  /* -------------------- */
  {
    path: '',
    component: AuthTplComponent,
    canActivateChild: [authSystemUserIsNotLoggedInGuard()],
    children: [
      {
        path: 'bienvenido',
        loadComponent: () => import('./pages/@auth/auth-page/auth-page.component'),
        data: { name: 'AuthPage' }
      },
    ],
    data: { groupName: 'AuthTpl' }
  },
  /* -------------------- */
  {
    path: 'forbidden',
    loadComponent: () => import('./pages/@errors/forbidden-page/forbidden-page.component'),
    data: { name: 'ErrorForbiddenPage' }
  },
  {
    path: '**',
    loadComponent: () => import('./pages/@errors/not-found-page/not-found-page.component'),
    data: { name: 'ErrorNotFoundPage' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledNonBlocking',
    bindToComponentInputs: true,
    // Esta opción no restaura el scroll cuando se refresca la página.
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(
    viewportScroller: ViewportScroller,
    router: Router,
    routeS: RouteService,
    taxonomyS: TaxonomyService,
    // gtmService: GoogleTagManagerService,
  ) {

    // router.events.pipe(
    //   filter((e: Event): e is Scroll => e instanceof Scroll),
    // ).subscribe(e => {
    //   if (e.position) {
    //     // backward navigation
    //     viewportScroller.scrollToPosition(e.position);
    //   } else if (e.anchor) {
    //     // anchor navigation
    //     viewportScroller.scrollToAnchor(e.anchor);
    //   } else {
    //     // forward navigation
    //     viewportScroller.scrollToPosition([0, 0]);
    //   }
    // });

    toObservable(routeS.currentPage).subscribe((value) => {
      taxonomyS.resolve(value);

      // gtmService.pushTag({
      //   event: 'page',
      //   pageName: value.url
      // });
    });
  }
}
