import { ConfigOption } from '@ngx-formly/core';
import { FormlyAction } from './action.type';

export function withFormlyFieldAction(): ConfigOption {
  return {
    types: [{ name: 'action', component: FormlyAction }],
  };
}
