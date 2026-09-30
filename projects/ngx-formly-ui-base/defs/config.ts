import { InjectionToken } from '@angular/core';
import { AppConfig } from './models';

export const FORMLY_APP_CONFIG = new InjectionToken<AppConfig>(
  'formlyAppConfig',
);
