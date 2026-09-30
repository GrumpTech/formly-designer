import { ConfigOption } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';
import { withFormlyFieldDatepicker } from '@ngx-formly/primeng/datepicker';
import { withFormlyUiBase } from '@grumptech/ngx-formly-ui-base';
import { withFormlyFieldAction } from '@grumptech/ngx-formly-ui-prime-ng/action';
import { withFormlyFieldArray } from '@grumptech/ngx-formly-ui-prime-ng/array';
import { withFormlyFieldDialogButton } from '@grumptech/ngx-formly-ui-prime-ng/dialog-button';
import { withFormlyFieldGrid } from '@grumptech/ngx-formly-ui-prime-ng/grid';
import { withFormlyFieldLink } from '@grumptech/ngx-formly-ui-prime-ng/link';
import { withFormlyFieldLoadAction } from '@grumptech/ngx-formly-ui-prime-ng/load-action';
import { withFormlyFieldMultischema } from '@grumptech/ngx-formly-ui-prime-ng/multischema';
import { withFormlyFieldObject } from '@grumptech/ngx-formly-ui-prime-ng/object';
import { withFormlyFieldSaveAction } from '@grumptech/ngx-formly-ui-prime-ng/save-action';
import { withFormlyFieldUrlSelect } from '@grumptech/ngx-formly-ui-prime-ng/url-select';

export function withFormlyUiPrimeNg(): ConfigOption[] {
  return [
    ...withFormlyUiBase(),
    ...withFormlyPrimeNG(),
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
    {
      types: [{ name: 'datetimepicker', extends: 'datepicker' }],
    },
  ];
}
