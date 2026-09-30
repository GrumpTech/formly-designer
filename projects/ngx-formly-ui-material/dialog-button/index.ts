import { ConfigOption } from '@ngx-formly/core';
import { FormlyDialogButton } from './dialog-button.type';

export function withFormlyFieldDialogButton(): ConfigOption {
  return {
    types: [{ name: 'dialog-button', component: FormlyDialogButton }],
  };
}
