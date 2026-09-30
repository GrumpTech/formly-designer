import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorDropContainer } from './drop-container.type';

export function withFormlyFieldDropContainer(): ConfigOption {
  return {
    types: [
      {
        name: 'formly-editor-drop-container',
        component: FormlyEditorDropContainer,
      },
    ],
  };
}
