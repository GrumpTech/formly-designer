import { ConfigOption } from '@ngx-formly/core';
import { FormlyLoadAction } from './load-action.type';

export function withFormlyFieldLoadAction(): ConfigOption {
  return {
    types: [{ name: 'load-action', component: FormlyLoadAction }],
  };
}
