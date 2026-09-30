import { ConfigOption } from '@ngx-formly/core';
import { FormlyArray } from './array.type';

export function withFormlyFieldArray(): ConfigOption {
  return {
    types: [{ name: 'array', component: FormlyArray }],
  };
}
