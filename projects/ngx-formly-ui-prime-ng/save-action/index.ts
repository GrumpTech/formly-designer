import { ConfigOption } from '@ngx-formly/core';
import { FormlySaveAction } from './save-action.type';

export function withFormlyFieldSaveAction(): ConfigOption {
  return {
    types: [{ name: 'save-action', component: FormlySaveAction }],
  };
}
