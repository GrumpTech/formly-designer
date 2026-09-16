import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => initialize()),
    provideRouter(routes),
    provideHttpClient(),

    // for material
    provideNativeDateAdapter(),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },

    // for primeng
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    MessageService,
  ],
};

function initialize(): void {
  if (environment.applyRedirect) {
    const prefix = environment.storagePrefix;
    const redirect = sessionStorage.getItem(`${prefix}redirect`);
    sessionStorage.removeItem(`${prefix}redirect`);
    if (
      redirect &&
      redirect.startsWith(document.baseURI) &&
      redirect != location.href
    ) {
      history.replaceState(null, '', redirect);
    }
  }
}
