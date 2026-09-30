import { ConfigOption } from '@ngx-formly/core';
import { FormlyUrlSelect } from './url-select.type';

export function withFormlyFieldUrlSelect(): ConfigOption {
  return {
    types: [
      {
        name: 'url-select',
        component: FormlyUrlSelect,
        wrappers: ['form-field'],
      },
    ],
  };
}
