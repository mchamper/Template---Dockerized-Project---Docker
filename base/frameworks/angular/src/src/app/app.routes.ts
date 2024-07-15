import { Route } from '@angular/router';
import { TRouteData } from './core/types/route-data.type';
import { authIsLoggedInGuard } from './core/guards/auth-is-logged-in.guard';
import { authIsVerifiedGuard } from './core/guards/auth-is-verified.guard';
import { authCanGuard } from './core/guards/auth-can.guard';
import { MainTplComponent } from './components/templates/main-tpl/main-tpl.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ForbiddenPageComponent } from './pages/@errors/forbidden-page/forbidden-page.component';
import { NotFoundPageComponent } from './pages/@errors/not-found-page/not-found-page.component';
import { AuthTplComponent } from './components/templates/auth-tpl/auth-tpl.component';
import { SystemUserListPageComponent } from './pages/system-user-list-page/system-user-list-page.component';
import { AuthPageComponent } from './pages/@auth/auth-page/auth-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { SystemUserCreatePageComponent } from './pages/system-user-create-page/system-user-create-page.component';
import { SystemUserUpdatePageComponent } from './pages/system-user-update-page/system-user-update-page.component';

export const routes: Route[] = [
  {
    path: '',
    component: MainTplComponent,
    canActivateChild: [authIsLoggedInGuard('systemUser')],
    children: [
      {
        path: '',
        canActivateChild: [
          authIsVerifiedGuard('systemUser'),
          authCanGuard('systemUser'),
        ],
        children: [
          {
            path: '',
            loadComponent: () => HomePageComponent,
            data: { name: 'HomePage' }
          },
          {
            path: 'usuarios',
            loadComponent: () => SystemUserListPageComponent,
            data: { name: 'SystemUserListPage', permissions: ['SystemUserGet'] }
          },
          {
            path: 'usuarios/crear',
            loadComponent: () => SystemUserCreatePageComponent,
            data: { name: 'SystemUserCreatePage', permissions: ['SystemUserCreate'] }
          },
          {
            path: 'usuarios/:systemUserId',
            loadComponent: () => SystemUserUpdatePageComponent,
            data: { name: 'SystemUserUpdatePage', permissions: ['SystemUserUpdate'] }
          },
        ]
      },
      {
        path: 'cuenta',
        loadComponent: () => AccountPageComponent,
        data: { name: 'AccountPage' }
      },
      /* -------------------- */
      {
        path: 'forbidden',
        loadComponent: () => ForbiddenPageComponent,
        data: { name: 'ErrorForbiddenPage' }
      },
      {
        path: '404',
        loadComponent: () => NotFoundPageComponent,
        data: { name: 'ErrorNotFoundPage' }
      },
    ],
    data: { tpl: 'MainTpl' },
  },
  /* -------------------- */
  {
    path: '',
    component: AuthTplComponent,
    // canActivateChild: [authIsNotLoggedInGuard('systemUser')],
    children: [
      {
        path: 'bienvenido',
        loadComponent: () => AuthPageComponent,
        data: { name: 'AuthPage' }
      },
    ],
    data: { tpl: 'AuthTpl' },
  },
  /* -------------------- */
  {
    path: '**',
    redirectTo: '/404'
  },
];
