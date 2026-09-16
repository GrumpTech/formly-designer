import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideFormlyCore } from '@ngx-formly/core';
import { provideFormlyAppConfig } from '@grumptech/ngx-formly-ui-base';
import {
  MessageService,
  withFormlyUiMaterial,
} from '@grumptech/ngx-formly-ui-material';
import { routes } from './app.routes';
import { FormLoader } from './services/form-loader';
import { CustomErrorMessage } from './types/custom-app-error/custom-error-message.type';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFormlyCore(
      withFormlyUiMaterial().concat([
        { types: [{ name: 'error-message', component: CustomErrorMessage }] },
      ]),
    ),
    provideFormlyAppConfig({
      baseUrl: '/api',
      formLoader: FormLoader,
      messageService: MessageService,
    }),
    provideNativeDateAdapter(),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
};
