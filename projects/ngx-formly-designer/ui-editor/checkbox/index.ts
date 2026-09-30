import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorCheckbox } from './checkbox.type';

export function withFormlyFieldCheckbox(): ConfigOption {
  return {
    types: [
      {
        name: 'formly-editor-checkbox',
        component: FormlyEditorCheckbox,
        defaultOptions: { parsers: [(val) => val || undefined] },
      },
    ],
  };
}
