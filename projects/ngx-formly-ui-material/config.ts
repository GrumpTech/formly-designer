import { ConfigOption, FormlyExtension } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldDatepicker } from '@ngx-formly/material/datepicker';
import { withFormlyUiBase } from '@grumptech/ngx-formly-ui-base';
import { FormlyArray } from './types/array.type';
import { FormlyGrid } from './types/grid.type';
import { FormlyLink } from './types/link.type';
import { FormlyMultiSchema } from './types/multischema.type';
import { FormlyObject } from './types/object.type';
import { FormlyAction } from './types/action.type';
import { FormlyLoadAction } from './types/load-action.type';
import { FormlySaveAction } from './types/save-action.type';
import { FormlyDialogButton } from './types/dialog-button.type';
import { FormlyUrlSelect } from './types/url-select.type';

export function withFormlyUiMaterial(): ConfigOption[] {
  return [
    withFormlyUiBase(),
    ...withFormlyMaterial(),
    withFormlyFieldDatepicker(),
    {
      extensions: [
        {
          name: 'fixHeight',
          extension: fixHeightExtension,
        },
      ],
      types: [
        { name: 'datetimepicker', extends: 'datepicker' },
        { name: 'array', component: FormlyArray },
        { name: 'grid', component: FormlyGrid },
        {
          name: 'link',
          component: FormlyLink,
          wrappers: ['form-field'],
        },
        { name: 'multischema', component: FormlyMultiSchema },
        { name: 'object', component: FormlyObject },
        { name: 'action', component: FormlyAction },
        { name: 'load-action', component: FormlyLoadAction },
        { name: 'save-action', component: FormlySaveAction },
        { name: 'dialog-button', component: FormlyDialogButton },
        {
          name: 'url-select',
          component: FormlyUrlSelect,
          wrappers: ['form-field'],
        },
      ],
    },
  ];
}

const fixHeightExtension: FormlyExtension = {
  prePopulate(field): void {
    if (
      field.type === 'checkbox' ||
      field.type === 'boolean' ||
      field.type === 'link'
    ) {
      field.className ??= '';
      if (
        field.className.indexOf('formly-fixed-height-mat-form-field') === -1
      ) {
        field.className =
          `${field.className} formly-fixed-height-mat-form-field`.trimStart();
      }
    }
  },
};
