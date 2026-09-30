import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorWarning } from './warning.type';

export function withFormlyFieldWarning(): ConfigOption {
  return {
    types: [{ name: 'formly-editor-warning', component: FormlyEditorWarning }],
  };
}
