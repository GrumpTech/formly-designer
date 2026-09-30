import { ConfigOption } from '@ngx-formly/core';
import { FormlyMultiSchema } from './multischema.type';

export function withFormlyFieldMultischema(): ConfigOption {
  return {
    types: [{ name: 'multischema', component: FormlyMultiSchema }],
  };
}
