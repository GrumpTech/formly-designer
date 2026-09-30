import { ConfigOption } from '@ngx-formly/core';
import { FormlyGrid } from './grid.type';

export function withFormlyFieldGrid(): ConfigOption {
  return {
    types: [{ name: 'grid', component: FormlyGrid }],
  };
}
