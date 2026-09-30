import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorMenuDialog } from './menu-dialog.type';

export function withFormlyFieldMenuDialog(): ConfigOption {
  return {
    types: [
      { name: 'formly-editor-menu-dialog', component: FormlyEditorMenuDialog },
    ],
  };
}
