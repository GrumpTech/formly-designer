import { ConfigOption } from '@ngx-formly/core';
import { FormlyMessageContainer } from './message-container.type';

export function withFormlyFieldMessageContainer(): ConfigOption {
  return {
    types: [{ name: 'message-container', component: FormlyMessageContainer }],
  };
}
