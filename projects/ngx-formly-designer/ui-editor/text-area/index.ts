import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorTextarea } from './textarea.type';

export function withFormlyFieldTextarea(): ConfigOption {
  return {
    types: [
      { name: 'formly-editor-textarea', component: FormlyEditorTextarea },
    ],
  };
}
