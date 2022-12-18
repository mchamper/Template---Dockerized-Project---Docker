import { ViewportScroller } from '@angular/common';
import { NgModule } from '@angular/core';
import { Event, Router, RouterModule, Routes, Scroll } from '@angular/router';
import { filter } from 'rxjs';
import { MainTplComponent } from './components/templates/main-tpl/main-tpl.component';

const getTitle = (title?: string): string => {
  if (title) {
    return `${title} - Title`;
  }

  return 'Title';
}

const routes: Routes = [
  {
    path: '',
    component: MainTplComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home-page/home-page.component'), title: getTitle(), data: { name: 'HomePage' } },
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
