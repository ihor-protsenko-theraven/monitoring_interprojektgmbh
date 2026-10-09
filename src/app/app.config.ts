import { DOCUMENT } from '@angular/common';
import { applyTheme } from './shared/utils/theme.utils';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import uk from '@angular/common/locales/uk';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
registerLocaleData(uk);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => applyTheme(inject(DOCUMENT))),
    { provide: LOCALE_ID, useValue: 'uk' },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
