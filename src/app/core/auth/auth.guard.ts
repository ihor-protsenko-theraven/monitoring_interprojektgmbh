import { ROUTE_URLS } from '../config/navigation.config';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () =>
  inject(AuthService).authenticated() || inject(Router).createUrlTree([ROUTE_URLS.login]);

export const guestGuard: CanActivateFn = () =>
  !inject(AuthService).authenticated() || inject(Router).createUrlTree([ROUTE_URLS.stations]);
