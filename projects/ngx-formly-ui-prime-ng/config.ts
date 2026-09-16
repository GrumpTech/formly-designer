import { ConfigOption, FormlyExtension } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';
import { withFormlyFieldDatepicker } from '@ngx-formly/primeng/datepicker';
import { withFormlyUiBase } from '@grumptech/ngx-formly-ui-base';
import { FormlyArray } from './types/array.type';
import { FormlyGrid } from './types/grid.type';
import { FormlyLink } from './types/link.type';
import { FormlyMultiSchema } from './types/multischema.type';
import { FormlyObject } from './types/object.type';
import { FormlyAction } from './types/action.type';
import { FormlyLoadAction } from './types/load-action.type';
import { FormlySaveAction } from './types/save-action.type';
import { FormlyUrlSelect } from './types/url-select.type';
import { FormlyDialogButton } from './types/dialog-button.type';

export function withFormlyUiPrimeNg(): ConfigOption[] {
  return [
    withFormlyUiBase(),
    ...withFormlyPrimeNG(),
    withFormlyFieldDatepicker(),
    {
      types: [
        { name: 'datetimepicker', extends: 'datepicker' },
        { name: 'array', component: FormlyArray },
        { name: 'grid', component: FormlyGrid },
        { name: 'link', component: FormlyLink },
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
