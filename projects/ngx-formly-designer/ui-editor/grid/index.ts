import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorGrid } from './grid.type';

export function withFormlyFieldGrid(): ConfigOption {
  return {
    types: [{ name: 'formly-editor-grid', component: FormlyEditorGrid }],
  };
}
