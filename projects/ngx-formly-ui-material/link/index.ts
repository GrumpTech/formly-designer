import { ConfigOption } from '@ngx-formly/core';
import { FormlyLink } from './link.type';

export function withFormlyFieldLink(): ConfigOption {
  return {
    types: [{ name: 'link', component: FormlyLink, wrappers: ['form-field'] }],
  };
}
