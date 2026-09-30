import { ConfigOption } from '@ngx-formly/core';
import { FormlyObject } from './object.type';

export function withFormlyFieldObject(): ConfigOption {
  return {
    types: [{ name: 'object', component: FormlyObject }],
  };
}
