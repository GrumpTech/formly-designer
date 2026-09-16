import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorArrayDialog } from './types/array-dialog.type';
import { FormlyEditorCheckbox } from './types/checkbox.type';
import { FormlyEditorGroup } from './types/field-editor-group.type';
import { FormlyEditorGrid } from './types/grid.type';
import { FormlyEditorInput } from './types/input.type';
import { FormlyEditorSelect } from './types/select.type';
import { FormlyEditorTextarea } from './types/textarea.type';
import { FormlyEditorMenuDialog } from './types/menu-dialog.type';

export function withFormlyEditorTypes(): ConfigOption {
  return {
    types: [
      {
        name: 'formly-editor-array-dialog',
        component: FormlyEditorArrayDialog,
      },
      {
        name: 'formly-editor-checkbox',
        component: FormlyEditorCheckbox,
        defaultOptions: { parsers: [(val) => val || undefined] },
      },
      {
        name: 'formly-editor-grid',
        component: FormlyEditorGrid,
      },
      {
        name: 'formly-editor-group',
        component: FormlyEditorGroup,
      },
      {
        name: 'formly-editor-input',
        component: FormlyEditorInput,
        defaultOptions: {
          parsers: [(val) => val || undefined],
        },
      },
      {
        name: 'formly-editor-input-number',
        extends: 'formly-editor-input',
        defaultOptions: {
          props: { type: 'number' },
          parsers: [(val) => (val ? (parseInt(val, 10) as any) : undefined)],
        },
      },
      {
        name: 'formly-editor-select',
        component: FormlyEditorSelect,
      },
      {
        name: 'formly-editor-textarea',
        component: FormlyEditorTextarea,
        defaultOptions: {
          parsers: [(val) => val || undefined],
        },
      },
      {
        name: 'formly-editor-menu-dialog',
        component: FormlyEditorMenuDialog,
      },
    ],
  };
}
