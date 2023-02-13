import { ViewportScroller } from '@angular/common';
import { NgModule } from '@angular/core';
import { Event, Router, RouterModule, Routes, Scroll } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { filter } from 'rxjs';
import { MainTplComponent } from './components/templates/main-tpl/main-tpl.component';
import { RouteService } from './services/route.service';
import { TaxonomyService } from './taxonomies/taxonomy.service';

const routes: Routes = [
  /* -------------------- */
  {
    path: '',
    component: MainTplComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home-page/home-page.component'), data: { name: 'HomePage' } },
      { path: 'inquilinos', loadComponent: () => import('./pages/tenants-page/tenants-page.component'), data: { name: 'TenantsPage' } },
      { path: 'propietarios', loadComponent: () => import('./pages/owners-page/owners-page.component'), data: { name: 'OwnersPage' } },
      { path: 'empresas', loadComponent: () => import('./pages/companies-page/companies-page.component'), data: { name: 'CompaniesPage' } },
      { path: 'seguros', loadComponent: () => import('./pages/ensurances-page/ensurances-page.component'), data: { name: 'EnsurancesPage' } },
      { path: 'cotizador', loadComponent: () => import('./pages/quote-page/quote-page.component'), data: { name: 'QuotePage', isSolofo: false } },
      { path: 'solofo', loadComponent: () => import('./pages/quote-page/quote-page.component'), data: { name: 'QuotePage', isSolofo: true } },
      { path: 'inmobiliarias', loadComponent: () => import('./pages/real-estate-page/real-estate-page.component'), data: { name: 'RealEstatePage' } },
    ]
  },
  /* -------------------- */
  { path: '**', redirectTo: '' },
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

    routeS.onNavigationEnd$().subscribe((value) => {
      gtmService.pushTag({
        event: 'page',
        pageName: value.url
      });
    });

    routeS.currentPage$.subscribe((value) => {
      taxonomyS.resolve(value);
    });
  }
}
