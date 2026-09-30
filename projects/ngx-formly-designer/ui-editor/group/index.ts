import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorGroup } from './group.type';

export function withFormlyFieldGroup(): ConfigOption {
  return {
    types: [{ name: 'formly-editor-group', component: FormlyEditorGroup }],
  };
}
