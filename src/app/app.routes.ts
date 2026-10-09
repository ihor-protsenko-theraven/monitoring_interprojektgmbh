import { ROUTE_PATHS } from './core/config/navigation.config';
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: ROUTE_PATHS.login,
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/components/login/login').then((m) => m.Login),
  },
  {
    path: ROUTE_PATHS.stations,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/stations/components/stations-shell/stations-shell').then(
        (m) => m.StationsShell,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/stations/components/stations-hub/stations-hub').then(
            (m) => m.StationsHub,
          ),
      },
      {
        path: ROUTE_PATHS.stationId,
        loadComponent: () =>
          import('./features/stations/components/station-detail/station-detail').then(
            (m) => m.StationDetail,
          ),
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: ROUTE_PATHS.stations },
  { path: '**', redirectTo: ROUTE_PATHS.stations },
];
