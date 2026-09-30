import { ConfigOption } from '@ngx-formly/core';
import { FormlyEditorInput } from './input.type';

const inputType = {
  name: 'formly-editor-input',
  component: FormlyEditorInput,
  defaultOptions: {
    parsers: [(val: any) => val || undefined],
  },
};

export function withFormlyFieldInput(): ConfigOption {
  return {
    types: [inputType],
  };
}

export function withFormlyFieldInputAndInputNumber(): ConfigOption {
  return {
    types: [
      inputType,
      {
        name: 'formly-editor-input-number',
        extends: 'formly-editor-input',
        defaultOptions: {
          props: { type: 'number' },
          parsers: [(val) => (val ? (parseInt(val, 10) as any) : undefined)],
        },
      },
    ],
  };
}
