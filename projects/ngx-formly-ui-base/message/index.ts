import { ConfigOption } from '@ngx-formly/core';
import { FormlyMessage } from './message.type';

export * from './models';

export function withFormlyFieldMessage(): ConfigOption {
  return {
    types: [{ name: 'message', component: FormlyMessage }],
  };
}
