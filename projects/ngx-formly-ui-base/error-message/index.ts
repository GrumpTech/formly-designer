import { ConfigOption } from '@ngx-formly/core';
import { FormlyErrorMessage } from './error-message.type';

export * from './models';

export function withFormlyFieldErrorMessage(): ConfigOption {
  return {
    types: [{ name: 'error-message', component: FormlyErrorMessage }],
  };
}
