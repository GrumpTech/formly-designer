import { ConfigOption } from '@ngx-formly/core';
import { withFormlyFieldArrayDialog } from './array-dialog';
import { withFormlyFieldCheckbox } from './checkbox';
import { withFormlyFieldDropContainer } from './drop-container';
import { withFormlyFieldGrid } from './grid';
import { withFormlyFieldGroup } from './group';
import { withFormlyFieldInputAndInputNumber } from './input';
import { withFormlyFieldMenuDialog } from './menu-dialog';
import { withFormlyFieldSelect } from './select';
import { withFormlyFieldTextarea } from './text-area';
import { withFormlyFieldWarning } from './warning';

export function withFormlyEditorTypes(): ConfigOption[] {
  return [
    withFormlyFieldArrayDialog(),
    withFormlyFieldCheckbox(),
    withFormlyFieldDropContainer(),
    withFormlyFieldGrid(),
    withFormlyFieldGroup(),
    withFormlyFieldInputAndInputNumber(),
    withFormlyFieldMenuDialog(),
    withFormlyFieldSelect(),
    withFormlyFieldTextarea(),
    withFormlyFieldWarning(),
  ];
}
