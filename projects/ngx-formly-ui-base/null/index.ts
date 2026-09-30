import { ConfigOption } from '@ngx-formly/core';
import { FormlyNull } from './null.type';

export function withFormlyFieldNull(): ConfigOption {
  return {
    types: [{ name: 'null', component: FormlyNull }],
  };
}
