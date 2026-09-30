import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorArrayDialog } from './array-dialog.type';

export function withFormlyFieldArrayDialog(): ConfigOption {
  return {
    types: [
      {
        name: 'formly-editor-array-dialog',
        component: FormlyEditorArrayDialog,
      },
    ],
  };
}
