import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorSelect } from './select.type';

export function withFormlyFieldSelect(): ConfigOption {
  return {
    types: [{ name: 'formly-editor-select', component: FormlyEditorSelect }],
  };
}
