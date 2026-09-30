import { ConfigOption } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldDatepicker } from '@ngx-formly/material/datepicker';
import { withFormlyUiBase } from '@grumptech/ngx-formly-ui-base';
import { withFormlyFieldAction } from '@grumptech/ngx-formly-ui-material/action';
import { withFormlyFieldArray } from '@grumptech/ngx-formly-ui-material/array';
import { withFormlyFieldDialogButton } from '@grumptech/ngx-formly-ui-material/dialog-button';
import { withFormlyFieldGrid } from '@grumptech/ngx-formly-ui-material/grid';
import { withFormlyFieldLink } from '@grumptech/ngx-formly-ui-material/link';
import { withFormlyFieldLoadAction } from '@grumptech/ngx-formly-ui-material/load-action';
import { withFormlyFieldMultischema } from '@grumptech/ngx-formly-ui-material/multischema';
import { withFormlyFieldObject } from '@grumptech/ngx-formly-ui-material/object';
import { withFormlyFieldSaveAction } from '@grumptech/ngx-formly-ui-material/save-action';
import { withFormlyFieldUrlSelect } from '@grumptech/ngx-formly-ui-material/url-select';
import { withFormlyExtensionFixHeight } from '@grumptech/ngx-formly-ui-material/fix-height-extension';

export function withFormlyUiMaterial(): ConfigOption[] {
  return [
    ...withFormlyUiBase(),
    ...withFormlyMaterial(),
    withFormlyFieldDatepicker(),
    withFormlyFieldAction(),
    withFormlyFieldArray(),
    withFormlyFieldDialogButton(),
    withFormlyFieldGrid(),
    withFormlyFieldLink(),
    withFormlyFieldLoadAction(),
    withFormlyFieldMultischema(),
    withFormlyFieldObject(),
    withFormlyFieldSaveAction(),
    withFormlyFieldUrlSelect(),
    withFormlyExtensionFixHeight(),
    {
      types: [{ name: 'datetimepicker', extends: 'datepicker' }],
    },
  ];
}
