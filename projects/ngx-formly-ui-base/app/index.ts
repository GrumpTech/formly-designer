import { ConfigOption } from '@ngx-formly/core';
import { FormlyApp } from './app.type';

export * from './app-service';
export * from './models';

export function withFormlyFieldApp(): ConfigOption {
  return {
    types: [{ name: 'app', component: FormlyApp }],
  };
}
