import { ConfigOption } from '@ngx-formly/core';
import { FormlyPage } from './page.type';

export * from './models';
export * from './config';
export * from './page-service';
export * from './route-parameter-service';

export function withFormlyFieldPage(): ConfigOption {
  return {
    types: [{ name: 'page', component: FormlyPage }],
  };
}
