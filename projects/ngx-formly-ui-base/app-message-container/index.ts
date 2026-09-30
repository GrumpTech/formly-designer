import { ConfigOption } from '@ngx-formly/core';
import { FormlyAppMessageContainer } from './app-message-container.type';

export function withFormlyFieldAppMessageContainer(): ConfigOption {
  return {
    types: [
      { name: 'app-message-container', component: FormlyAppMessageContainer },
    ],
  };
}
